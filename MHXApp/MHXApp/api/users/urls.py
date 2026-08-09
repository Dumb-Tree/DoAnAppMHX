from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
r = DefaultRouter()
r.register('users', views.UserView, basename='users')
urlpatterns = [
    path('', include(r.urls)),
]