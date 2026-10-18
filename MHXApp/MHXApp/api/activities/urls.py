from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
r = DefaultRouter()
r.register('activities', views.ActivityViewSet, basename='activities')
r.register('registrations', views.ActivityRegistrationsViewSet,basename='registrations')
r.register('proofs',views.ActivityProofViewSet,basename='activity-proofs')
r.register('proof-images',views.ActivityProofImageViewSet,basename='activity-proof-images')
urlpatterns = [
    path('', include(r.urls)),
]