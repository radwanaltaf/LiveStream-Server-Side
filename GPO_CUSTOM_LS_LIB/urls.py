from django.urls import path 
from . import views
# from the same folder of challenges(.) imprt this app(module)


#creates URLS config 
urlpatterns = [
    path("", views.indexStream, name="index")
]