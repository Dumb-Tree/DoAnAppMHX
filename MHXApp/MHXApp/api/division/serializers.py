from rest_framework.serializers import ModelSerializer
from .models import Division

class DivisionSerializer(ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'