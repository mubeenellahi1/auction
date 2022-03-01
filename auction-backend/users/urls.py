from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('signup', SignUpApiViewSet,
                basename='SignupApi')
urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserLoginApiView.as_view()),
    path('facebooklogin/', UserFacebookLoginApiView.as_view()),
    path('googlelogin/', UserGoogleLoginApiView.as_view()),
    path('add-coins/', addcoins.as_view({'post': 'add'})),
    path('become-seller/', BecomeASeller.as_view({'post': 'create'})),


]
