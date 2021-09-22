import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token

from .models import Chat, ChatMessage


class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        chat_id = self.scope['url_route']['kwargs']['chat_id']
        # me = self.scope['user']
        # print(self.scope['user'])

        self.chat_obj = await self.get_chat(chat_id)
        self.chat_room = 'chat_%s' % self.chat_obj.id

        await self.channel_layer.group_add(
            self.chat_room,
            self.channel_name,
        )

        await self.send({
            'type': 'websocket.accept',
        })

    async def websocket_receive(self, event):

        front_text = event.get('text', None)
        if front_text is None:
            return
        
        loaded_data = json.loads(front_text)

        if loaded_data.get('event') == 'authorization':

            token = loaded_data.get('token', None)
            if token:
                token_obj = await self.get_user(token)
                await self.scope_c(token_obj)
            else:
                return
        else:
        
            message = loaded_data.get('message')
            user = self.scope['user']

            message_obj = await self.create_message(self.chat_obj, user, message)

            response = {
                'message': {
                    'id': message_obj.id,
                    'user_id': message_obj.sender.id,
                    'username': message_obj.sender.username,
                    'message': message_obj.message,
                    'timestamp': message_obj.timestamp,
                }
            }

            await self.channel_layer.group_send(
                self.chat_room,
                {
                    'type': 'chat.message.send',
                    'text': json.dumps(response, indent=4, sort_keys=True, default=str),
                }
            )

    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.chat_room,
            self.channel_name
        )

    async def chat_message_send(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['text'],
        })

    async def chat_message_delete(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['text'],
        })

    @sync_to_async
    def scope_c(self, token_obj):
        self.scope['user'] = token_obj.user

    @database_sync_to_async
    def get_user(self, token):
        return Token.objects.get(key=token)

    @database_sync_to_async
    def get_chat(self, chat_id):
        return Chat.objects.get(pk=chat_id)

    @database_sync_to_async
    def create_message(self, chat_obj, user, message):
        return ChatMessage.objects.create(chat=chat_obj, sender=user, message=message)
