from django.http import response
from .models import *
from rest_framework import serializers
from djoser.serializers import TokenCreateSerializer

from django.contrib.auth import get_user_model


class UsersSerializer(serializers.ModelSerializer):
    """Users list"""

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'username', 'is_staff', 'is_superuser')


class UsersListSerializer(serializers.PrimaryKeyRelatedField, serializers.ModelSerializer):
    """Users Information Edit"""

    class Meta:
        model = get_user_model()
        fields = ('__all__')


class MessagesSerializer(serializers.ModelSerializer):
    """Messages list"""
    sender = UsersSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = '__all__'


class ChatsSerializer(serializers.ModelSerializer):
    """Chats list"""
    members = UsersSerializer(many=True)

    class Meta:
        model = Chat
        fields = '__all__'


class ChatsUpdateSerializer(ChatsSerializer):
    """Chats update"""
    members = UsersListSerializer(many=True, queryset=get_user_model().objects.all())

    class Meta:
        model = Chat
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    
    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name', 'username', 'password']
 
    def save(self, *args, **kwargs):
        user = super().save(*args, **kwargs)
        user.first_name = self.validated_data['first_name']
        user.last_name = self.validated_data['last_name']
        user.set_password(self.validated_data['password'])
        user.save()
        return user
