"""
WSGI config for ferremas project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""
import os
import sys

# Añade al path el directorio padre del directorio donde está este archivo (wsgi.py)
# Es decir, si wsgi.py está en ferremas/, añade el folder que contiene ferremas/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("Sys.path after append:", sys.path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ferremas.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()