from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser
from .models import Division, DivisionRegistration
from .serializers import DivisionSerializer, DivisionRegisterSerializer
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
# Create your views here.

class DivisionPagination(PageNumberPagination):
  page_size = 5
  max_page_size = 100

class DivisionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [AllowAny]
    pagination_class = DivisionPagination
    
def index(request):
    return render(request, template_name='index.html', context =
    { 'name':'MHXApp'})
    
class DivisionRegisterViewSet(viewsets.ModelViewSet):
    queryset= DivisionRegistration.objects.all();
    serializer_class = DivisionRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'volunteer':
            return DivisionRegistration.objects.filter(
                volunteer=user
            )
        if user.role == 'leader':
            if not user.division:
                return DivisionRegistration.objects.none()
            return DivisionRegistration.objects.filter(
                division=user.division
            )
    def perform_create(self, serializer):
        serializer.save(volunteer=self.request.user)
    @action(
    methods=["get"],
    detail=False,
    url_path="waiting-list"
)
    def waiting_list(self, request):
        if request.user.role != "leader":
            return Response(
                {"detail": "Chỉ có leader mới có thể truy cập."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.division:
            return Response(
                {"detail": "Người dùng không có đội hình."},
                status=status.HTTP_400_BAD_REQUEST
            )

        registrations = DivisionRegistration.objects.filter(
            division=request.user.division,
            Status="pending"
        )

        serializer = self.get_serializer(
            registrations,
            many=True
        )

        return Response(serializer.data)
    @action(
        methods=['post'],
        detail=True,
        url_path='accept'
    )
    def accept(self, request, pk=None):

        if request.user.role != 'leader':
            return Response(
                {"detail": "Chỉ có leader mới có thể chấp nhận đăng ký."},
                status=status.HTTP_403_FORBIDDEN
            )
        if not request.user.division:
            return Response(
                {"detail": "Người dùng không có đội hình."},
                status=status.HTTP_400_BAD_REQUEST
            )
        with transaction.atomic():
            registration = DivisionRegistration.objects.select_for_update().get(pk=pk)

        if registration.division != request.user.division:
            return Response(
                {"detail": "Bạn không được phép quản lý những đăng ký này."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if registration.Status != "pending":
            return Response(
                {"detail": "Đăng ký này không còn ở trạng thái chờ."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if volunteer := registration.volunteer:
            if volunteer.division:
                return Response(
                    {"detail": "Người dùng này đã có đội hình rồi."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        registration.Status = "approved"
        registration.save()
        registration.volunteer.division = request.user.division
        registration.volunteer.save()
        DivisionRegistration.objects.filter(
        volunteer=registration.volunteer,Status="pending").exclude(id=registration.id).update(Status="cancelled")
        return Response(
            self.get_serializer(registration).data
        )
    @action(
    methods=["post"],
    detail=True,
    url_path="deny"
)
    def deny(self, request, pk=None):
        user = request.user

        if user.role != "leader":
            return Response(
                {"detail": "Chỉ có leader mới có thể từ chối đăng ký."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.division:
            return Response(
                {"detail": "Leader không có đội hình."},
                status=status.HTTP_400_BAD_REQUEST
            )

        registration = self.get_object()

        if registration.division != user.division:
            return Response(
                {"detail": "Bạn không được phép quản lý những đăng ký này."},
                status=status.HTTP_403_FORBIDDEN
            )

        if registration.Status != "pending":
            return Response(
                {"detail": "Đăng ký này không còn ở trạng thái chờ."},
                status=status.HTTP_400_BAD_REQUEST
            )

        registration.Status = "rejected"
        registration.save()

        return Response({
            "message": "Registration denied.",
            "registration": self.get_serializer(registration).data
        })
    @action(
    methods=['post'],
    detail=True,
    url_path='cancel'
)
    def cancel(self, request, pk=None):
        registration = self.get_object()

        if registration.volunteer != request.user:
            return Response(
                {"detail": "Bạn chỉ có thể hủy bỏ đăng ký của chính mình."},
                status=status.HTTP_403_FORBIDDEN
            )

        if registration.Status != "pending":
            return Response(
                {"detail": "Chỉ có thể hủy bỏ những đăng ký đang chờ."},
                status=status.HTTP_400_BAD_REQUEST
            )

        registration.Status = "cancelled"
        registration.save()

        return Response(self.get_serializer(registration).data)