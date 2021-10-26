from django.urls import path

from GPO_CUSTOM_LS_LIB.api.views import api_create_user_view

app_name = 'GPO_CUSTOM_LS_LIB'

urlpatterns = [
    path("create", api_create_user_view, name="create")
]
