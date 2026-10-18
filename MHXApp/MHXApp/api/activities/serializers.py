from rest_framework.serializers import ModelSerializer
from .models import Activity,ActivityRegistration,ActivityProof,ActivityProofImage
from ..campaign.models import Campaign
from rest_framework import serializers
from django.utils import timezone
class ImageSerializer(ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['image'] = instance.image.url

        return data

class ActivitySerializer(ModelSerializer):
    proof_submitted = serializers.SerializerMethodField()
    
    campaign = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    def validate(self, data):
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        if start_time >= end_time:
            raise serializers.ValidationError(
                "Thời gian kết thúc phải sau thời gian bắt đầu."
            )
        campaign = Campaign.objects.filter(
            campaignStartDate__lte=start_time.date(),
            campaignEndDate__gte=end_time.date()
        ).first()

        if not campaign:
            raise serializers.ValidationError("Thời gian hoạt động phải nằm trong thời gian chiến dịch Mùa Hè Xanh.")
        data["campaign"] = campaign
        return data
    class Meta:
        model=Activity
        fields = '__all__'
    def get_proof_submitted(self, obj):
        return ActivityProof.objects.filter(
            activity=obj
        ).exists()
class ActivityRegistrationSerializer(ModelSerializer):
    volunteer = serializers.PrimaryKeyRelatedField(read_only = True)
    username = serializers.CharField(source="volunteer.username",read_only=True)
    MSSV = serializers.CharField(source="volunteer.MSSV",read_only=True)
    divisionName = serializers.CharField(source='activity.division.divisionName',read_only=True)
    class Meta:
        model = ActivityRegistration
        fields = ['id', 'activity','volunteer','divisionName','MSSV','username', 'register_status','register_time']
    def validate(self, data):
        request = self.context["request"]
        volunteer = request.user
        activity = data["activity"]
        registrations = ActivityRegistration.objects.filter(volunteer=volunteer).exclude(register_status="cancelled").select_related("activity")
        for registration in registrations:
            existing_activity = registration.activity
            if (existing_activity.start_time < activity.end_time and
                existing_activity.end_time > activity.start_time):
                raise serializers.ValidationError({"detail": f"Bạn đã đăng ký hoạt động '{existing_activity.name}' có thời gian trùng."})
        return data
class ActivityProofImageSerializer(ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ActivityProofImage
        fields = '__all__'
    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url

        return None 
class ActivityProofSerializer(ModelSerializer):
    images = ActivityProofImageSerializer(
        many=True,
        read_only=True
    )
    submitted_by_name = serializers.SerializerMethodField()
    class Meta:
        model= ActivityProof
        fields = '__all__'
    def get_submitted_by_name(self, obj):
        return (
            f"{obj.submitted_by.first_name} "
            f"{obj.submitted_by.last_name}"
        )
    

        