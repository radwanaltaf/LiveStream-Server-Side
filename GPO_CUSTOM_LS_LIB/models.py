from django.db import models

# Create your models here.
class User(models.Model):
    titleG = models.CharField(max_length=200, null=False, blank=False, default='')
    brandIdG = models.IntegerField(null=False, blank=False, default=1)
    usernameG = models.CharField(max_length=300, null=False, blank=False, default='Guest')
    isGuestG = models.BooleanField(null=False, blank=False, default=True)
    selectedCenterG = models.CharField(max_length=200, null=False, blank=False, default='')

    def __str__(self):
        return f"{self.titleG} {self.brandIdG}"


