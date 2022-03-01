
from users.views import ActivateAccount
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf.urls.static import static
from config import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("users/", include("users.urls")),
    path("product/", include("product.urls")),
    path('activate/<uuid>/<token>/', ActivateAccount,name='activate'), 
]
 
urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)