from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r'^ws/connect/(?P<id>[0-9a-f\-]+)/(?P<device_imei>[0-9a-fA-F]+)/(?P<license_key>[0-9a-fA-F\-]+)/$',
        consumers.Consumer.as_asgi()
    ),
]
