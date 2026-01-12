import sys, os

# Set the path to your Django project directory (where manage.py is located)
PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(PROJECT_PATH)

# Add the project root to the sys.path
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'attendvio.settings'

# Activate the virtual environment if needed (uncomment and set path if using venv)
# activate_this = '/home/username/virtualenv/yourenv/3.11/bin/activate_this.py'
# with open(activate_this) as file_:
#     exec(file_.read(), dict(__file__=activate_this))

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
