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