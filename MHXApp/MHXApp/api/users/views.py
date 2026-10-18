from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login as django_login
from rest_framework import status

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
            "division": request.user.division.id if request.user.division else None,
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
    
    def get_permissions(self):
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated()]
    
        return [permissions.AllowAny()]
    
    @action(methods=['post'], detail=False, permission_classes=[permissions.AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            django_login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        elif not username or not password:
            return Response({"detail": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)   
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)