from rest_framework.serializers import ModelSerializer
from .models import Campaign
from rest_framework import serializers

class CampaignSerializer(ModelSerializer):
    class Meta:
        model= Campaign
        fields = '__all__'
