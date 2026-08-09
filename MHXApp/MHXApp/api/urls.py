from django.urls import path, include 
from . import views
urlpatterns = [
    path('divisions/', include('api.division.urls')),
    path('users/', include('api.users.urls')),
]