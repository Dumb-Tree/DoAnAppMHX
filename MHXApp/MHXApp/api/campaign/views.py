from django.shortcuts import render
from .models import Campaign
from rest_framework import viewsets, permissions, generics, status
from .serializers import CampaignSerializer
# Create your views here.
class CampaignViewSet(viewsets.GenericViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Campaign.objects.filter(active=True)
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]