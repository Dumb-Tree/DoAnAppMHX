from rest_framework.serializers import ModelSerializer
from urllib3 import request


from .models import Division, DivisionRegistration
from rest_framework import serializers
class DivisionSerializer(ModelSerializer):
    picture = serializers.SerializerMethodField()
    class Meta:
        model = Division
        fields = '__all__'
    
    def get_picture(self, obj):
        if obj.picture:
            return obj.picture.url
        return None
    
class DivisionRegisterSerializer(ModelSerializer):
        volunteer = serializers.PrimaryKeyRelatedField(read_only=True)
        divisionName = serializers.CharField(source='division.divisionName',read_only=True)
        username = serializers.CharField(source="volunteer.username",read_only=True)
        MSSV = serializers.CharField(source="volunteer.MSSV",read_only=True)   
        class Meta:
            model = DivisionRegistration
            fields = ['id','volunteer','division','divisionName','MSSV','username','reason','Status','active','created_date','updated_date']
            read_only_fields = ['volunteer','divisionName','Status','active','created_date','updated_date']
        def validate(self, data):
            request = self.context["request"]
            volunteer = request.user
            division = data["division"]
            existed = DivisionRegistration.objects.filter(volunteer=volunteer,division=division).exists()
            if existed:
                raise serializers.ValidationError({"detail": "Bạn đã từng đăng ký đội hình này và không thể đăng ký lại."})
            return data

        def create(self, validated_data):
            validated_data["volunteer"] = self.context["request"].user
            return super().create(validated_data)