from django.core.checks import messages
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.jpg')


class Chat(models.Model):
    title = models.CharField(max_length=128, null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chat_owner', on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        objects = self.members.all().values('username')
        members = [obj['username'] for obj in objects]
        return f'{self.owner} - [{", ".join(members)}]'


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, null=True, blank=True, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} - {self.message[:50]}'
