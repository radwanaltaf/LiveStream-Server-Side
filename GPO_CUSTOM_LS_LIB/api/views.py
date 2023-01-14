from django.shortcuts import render
from django.template.response import TemplateResponse
from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view

from GPO_CUSTOM_LS_LIB.models import User 
from GPO_CUSTOM_LS_LIB.api.serializers import UserSerializer
from django.http import HttpResponse

@api_view(['POST', ])


# request is what the user is sending in POST request from POSTMAN or Front End
# return Response is what we are sending back from Django to POSTMAN or Front End as JSON or HTML or XML

# If want to save to DB table user then execute --> serializer.save()

def api_create_user_view(request):
    user = User()
    if request.method == "POST":
        print(request.data) 
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.data)
            # print(request.data)
            # print(serializer.data.get('isGuestG'))
            if len(request.data) == 5:
                return HttpResponse(render(request ,"GPO_CUSTOM_LS_LIB/viewer.html", {
                    "title": serializer.data.get('titleG'),
                    "brandId": serializer.data.get('brandIdG'),
                    "username": serializer.data.get('usernameG'),
                    "isGuest": 't' if serializer.data.get('isGuestG') == True else 'f',
                }))
            print(request.data) 
            return Response({"ErrorMessage": 'Required Fields Missing'}, status = status.HTTP_400_BAD_REQUEST)
