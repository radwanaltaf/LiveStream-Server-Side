from rest_framework import serializers
from GPO_CUSTOM_LS_LIB.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['id','titleG', 'brandIdG', 'usernameG', 'isGuestG']
        fields = ['titleG', 'brandIdG', 'usernameG', 'isGuestG']
