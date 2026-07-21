import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("filedrive")

# Read config from Django settings, using the `CELERY_` namespace prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Automatically discover tasks.py in your installed apps
app.autodiscover_tasks()


# Command to run Celery worker:
# docker compose -f docker-compose.base.yml run celery uv run celery -A config worker --loglevel=info
