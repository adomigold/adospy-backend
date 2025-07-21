from django.urls import path
from .views import hello_view, dashboard

urlpatterns = [
    path('', hello_view),
    path('dashboard', dashboard),
]
