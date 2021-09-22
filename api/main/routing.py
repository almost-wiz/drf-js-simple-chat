from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^api/v1/chats/(?P<chat_id>\d+)/messages/$', consumers.ChatConsumer.as_asgi()),
]
