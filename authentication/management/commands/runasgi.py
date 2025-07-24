from django.core.management.base import BaseCommand
import uvicorn

class Command(BaseCommand):
    help = 'Run ASGI server with Uvicorn (with reload)'

    def handle(self, *args, **options):
        uvicorn.run("core.asgi:application", host="0.0.0.0", port=8000, reload=True)
