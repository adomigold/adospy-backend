from django.urls import path
from .views import DashBoardView

urlpatterns = [
    path('dashboard', DashBoardView.as_view(), name="dashboard"),
]
