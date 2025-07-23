from inertia import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin

class DashBoardView(LoginRequiredMixin, View):
    template_name = "Dashboard"
    login_url = "/signin"

    def get(self, request):
        return render(request, self.template_name, props={})