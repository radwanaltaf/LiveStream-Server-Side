from django.contrib import admin
from .models import User
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "titleG", "brandIdG", "usernameG","isGuestG",)

admin.site.register(User, UserAdmin)

