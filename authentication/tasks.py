from celery import shared_task
import requests
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
