from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
r = DefaultRouter()
r.register('divisions', views.DivisionViewSet, basename='divisions')
r.register('divisionregistrations', views.DivisionRegisterViewSet,basename='divisionregistrations')
urlpatterns = [
    path('', include(r.urls)),
]