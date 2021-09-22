from os import name
from django.conf.urls import include
from django.urls import path
from .views import *


urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/login/', ObtainAuthToken.as_view()),

    path("users/", UsersViewSet.as_view({'get': 'list'})),
    path("users/<int:pk>/", UsersViewSet.as_view({'get': 'retrieve'})),
    path("users/<int:pk>/edit/", UsersViewSet.as_view({'put': 'update'})),

    path("chats/", ChatsViewSet.as_view({'get': 'list'})),
    path("chats/<int:pk>/", ChatsViewSet.as_view({'get': 'retrieve'})),
    path("chats/<int:pk>/messages/", MessagesViewSet.as_view({'get': 'list'})),
    path("chats/create/", ChatsViewSet.as_view({'post': 'create'})),
    path("chats/<int:pk>/edit/", ChatsViewSet.as_view({'put': 'update'})),
    path("chats/<int:pk>/delete/", ChatsViewSet.as_view({'delete': 'destroy'})),
]
