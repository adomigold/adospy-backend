from django.urls import path
from .views import SigninView, SignUpView, VerifyEmailView, ProfileView, TargetsView

urlpatterns = [
    path("signin/", SigninView.as_view(), name="signin"),
    path("signup/", SignUpView.as_view(), name="signup"),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("targets/", TargetsView.as_view(), name="targets"),
    path("targets/<uuid:target_id>/", TargetsView.as_view(), name="targets"),
]