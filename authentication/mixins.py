# mixins.py
from django.http import JsonResponse
from inertia import render
from django.views import View

class InertiaView(View):
    template_name = None  # e.g., "Signin"

    def get_props(self):
        return {}

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, props=self.get_props())
    
    def post(self, request, *args, **kwargs):
        return render(request, self.template_name, props=self.get_props())