# Server Side Application for Premium Outlets Live Stream

## Steps to run on local (dev env):
1. Activate the virtual env django_live_stream
2. Install the dependencies by running 
```
pip install -r /requirements.txt
```
3. Run the following:
```
DJANGO_DEVELOPMENT=true python manage.py runserver
```

## Env Setup for Dev & Prod
Currently as the project is pretty small, we are using the same settings.py file for both prod and dev. For dev we just add DJANGO_DEVELOPMENT=true to our env so it follows the settings needed to run on local and not on production server.