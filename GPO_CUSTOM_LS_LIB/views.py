from django.shortcuts import render, get_object_or_404, Http404
from .models import User 
# Create your views here.
def indexStream(request):
    # Err was here
    # user = get_object_or_404(User)
    # user = User()
    # context = {
    #     "title":user.titleG,
    #     "brandId":user.brandIdG,
    #     "username": user.usernameG ,
    #     "is_guest":user.isGuestG
    # }
 
    return render(request,"GPO_CUSTOM_LS_LIB/viewer.html")

    
