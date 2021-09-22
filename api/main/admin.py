from django.contrib import admin

from django.contrib.auth import get_user_model

from .models import ChatMessage as ChatMessageModel, Chat


class ChatMessage(admin.TabularInline):
    model = ChatMessageModel


class ChatAdmin(admin.ModelAdmin):
    inlines = [ChatMessage]

    class Meta:
        model = Chat


admin.site.register(Chat, ChatAdmin)
admin.site.register(ChatMessageModel)
admin.site.register(get_user_model())
