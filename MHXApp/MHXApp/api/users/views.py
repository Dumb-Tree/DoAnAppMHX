from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser

from api.division.models import Division

from .models import User
from .serializer import UserSerializer, serializers
from rest_framework.decorators import action



# to-fix: chuyển tất cả modelviewset sang viewset
class UserView(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.UpdateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser,]
    permission_classes=[permissions.IsAuthenticated]
    #pagination_class = UserPaginator

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "role": request.user.role,
            "MSSV": request.user.MSSV,
            "avatar": request.user.avatar.url if request.user.avatar else None,
        })
    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        Division = self.request.query_params.get('Division')
        parser_classes = [MultiPartParser, FormParser]
        if role:
            queryset = queryset.filter(role=role)
        if Division:
            queryset = queryset.filter(Division=Division)
        return queryset