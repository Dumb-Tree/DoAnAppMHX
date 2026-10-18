from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User

class ImageSerializer(ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['image'] = instance.image.url

        return data

class UserSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    MSSV = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="MSSV này đã có người dùng!"
            )
        ]
    )
    class Meta:
        model = User
        fields = ['id','MSSV','first_name','last_name','email','username','password','role','avatar','division']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        u = User(**validated_data)
        u.set_password(password)
        u.save()
        return u