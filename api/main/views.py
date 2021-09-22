from django.http.response import Http404
from django.core.exceptions import PermissionDenied
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import *

from .serializers import *
from .service import Pagination


class UsersViewSet(viewsets.ModelViewSet):
    """Users list output"""
    pagination_class = Pagination
    serializer_class = UsersSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        if self.action == 'list':
            return get_user_model().objects.exclude(pk=self.request.user.id)
        elif self.action == 'update':
            if self.request.user.id != self.kwargs['pk']:
                raise PermissionDenied()
        return get_user_model().objects.all()


class ChatsViewSet(viewsets.ModelViewSet):
    """Chats list output"""
    pagination_class = Pagination
    queryset = Chat.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    
    def get_serializer_class(self):
        if self.action in ['update', 'create']:
            return ChatsUpdateSerializer
        else:
            return ChatsSerializer

    def get_queryset(self):
        if self.action == 'list':
            all = Chat.objects.all()
            result = []
            for c in all:
                if self.request.user in c.members.all():
                    result.append(c)
        else:
            result = super().get_queryset()
        return result
    
    def get_object(self):
        result = super().get_object()
        if self.action == 'retrieve':
            if self.request.user not in result.members.all():
                raise PermissionDenied()
        elif self.action in ['update', 'destroy']:
            if self.request.user != result.owner:
                raise PermissionDenied()
        return result


class MessagesViewSet(viewsets.ModelViewSet):
    """Messages list output"""
    serializer_class = MessagesSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        try:
            chat = Chat.objects.get(id=self.kwargs['pk'])
        except Chat.DoesNotExist:
            raise Http404('Not found')
        if self.request.user not in chat.members.all():
            raise PermissionDenied()
        return ChatMessage.objects.filter(chat=self.kwargs['pk'])


class ObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(ObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'auth_token': token.key, 'user_id': token.user_id})
