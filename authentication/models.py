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
    device_network= models.CharField(max_length=225, null=True, blank=True)
    device_battery = models.CharField(max_length=225, null=True, blank=True)
    status = models.CharField(max_length=225, choices=STATUS_CHOICES, null=True, blank=True)
    plan_end = models.DateField(default=datetime.date.today)
    plan_type = models.CharField(max_length=225, null=True, blank=True, choices=PLAN_TYPES)
    last_sync = models.DateTimeField(null=True, blank=True)
    license_key = models.CharField(max_length=225, null=True, blank=True)
    payload_version = models.CharField(max_length=225, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_expired(self):
        return datetime.date.today() > self.plan_end

    class Meta:
        indexes = [
            models.Index(fields=['user', 'id']),
        ]