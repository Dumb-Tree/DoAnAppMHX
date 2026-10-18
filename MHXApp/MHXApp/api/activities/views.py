from django.db import models
from django.shortcuts import render
from django.utils import timezone
from .serializers import ActivitySerializer, ActivityRegistrationSerializer,ActivityProofSerializer,ActivityProofImageSerializer
from .models import Activity, ActivityRegistration,ActivityProofImage,ActivityProof
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

class ActivityViewSet(viewsets.GenericViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Activity.objects.filter(active=True)
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        activity = self.get_object()
        if request.user.role != 'leader':
            return Response(
                {"error": "Only leaders can cancel activities."},
                status=status.HTTP_403_FORBIDDEN
            )
        if timezone.now() >= activity.start_time:
            return Response(
                {"error": "Cannot cancel an activity that has already started."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if activity.status == Activity.ActivityStatus.CANCELLED:
            return Response(
                {"error": "Activity is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        activity.status = Activity.ActivityStatus.CANCELLED
        activity.save(update_fields=["status"])
        return Response({
            "message": "Activity cancelled successfully."
        })
        
    def get_queryset(self):
        user= self.request.user
        now = timezone.now()
        if user.role == 'leader':
            return Activity.objects.filter(active=True).order_by('start_time')

        registered_activity_ids = ActivityRegistration.objects.filter(
            volunteer=user,
            register_status=ActivityRegistration.RegistrationStatus.REGISTERED
        ).values_list('activity_id', flat=True)

        return Activity.objects.filter(
            active=True
        ).filter(
            models.Q(end_time__gt=now) | models.Q(id__in=registered_activity_ids)
        ).order_by('start_time')
        
    
    def perform_create(self, serializer):
        if self.request.user.role != 'leader':
            raise PermissionDenied(
                "Only leaders can create activities."
            )

        serializer.save()
    
    def check_activity_status(activity):
        now = timezone.now()

        registered_count = activity.registrations.filter(
            register_status=ActivityRegistration.RegistrationStatus.REGISTERED
        ).count()
        if (
            activity.status == Activity.ActivityStatus.UPCOMING
            and now >= activity.start_time
            and registered_count == 0
        ):
            activity.status = Activity.ActivityStatus.CANCELLED
            activity.save(update_fields=["status"])
        return activity
    
class ActivityRegistrationsViewSet(viewsets.GenericViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = ActivityRegistration.objects.all()
    serializer_class = ActivityRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        activity = serializer.validated_data['activity']
        volunteer = self.request.user
        
        if activity.start_time <= timezone.now():
            raise ValidationError(
                "Hoạt động đã bắt đầu, không được đăng ký"
            )
            
        if activity.status == Activity.ActivityStatus.CANCELLED:
            raise ValidationError(
                "Hoạt động này đã bị hủy."
            )
            
        already_registered = ActivityRegistration.objects.filter(
            activity=activity,
            volunteer=volunteer,
            register_status=ActivityRegistration.RegistrationStatus.REGISTERED 
        ).exists()
        
        if already_registered:
            raise ValidationError(
                "Bạn đã đăng ký hoạt động này rồi!"
            )
        existing_registration = ActivityRegistration.objects.filter(
            activity=activity,
            volunteer=volunteer
        ).first()
        
        if existing_registration:
            if existing_registration.register_status == ActivityRegistration.RegistrationStatus.REGISTERED:
                raise ValidationError("Bạn đã đăng ký hoạt động này rồi!")
                
            elif existing_registration.register_status == ActivityRegistration.RegistrationStatus.CANCELLED:
                existing_registration.register_status = ActivityRegistration.RegistrationStatus.REGISTERED
                if hasattr(existing_registration, 'register_time'):
                    existing_registration.register_time = timezone.now()
                existing_registration.save()
                serializer.instance = existing_registration
        else:
            serializer.save(
                volunteer=volunteer,
                register_status=ActivityRegistration.RegistrationStatus.REGISTERED
            )
        serializer.save(volunteer=volunteer)
    @action(
        detail=True,
        methods=['post'],
        url_path='cancel'
    )
    def cancel(self, request, pk=None):
        registration = self.get_object()
        
        if registration.volunteer != request.user:
            return Response(
                {"detail": "Bạn không được phép hủy đăng ký của người khác."},
                status=status.HTTP_403_FORBIDDEN
            )
        if registration.register_status == ActivityRegistration.RegistrationStatus.CANCELLED:
            return Response(
                {"detail": "Lượt đăng ký này đã hủy rồi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if registration.activity.start_time <= timezone.now():
            return Response(
                {"detail": "Bạn không được phép hủy đăng ký sau khi hoạt động đã bắt đầu."},
                status=status.HTTP_400_BAD_REQUEST
            )
        registration.register_status = ActivityRegistration.RegistrationStatus.CANCELLED
        registration.save()

        return Response(
            {"detail": "Hủy đăng ký thành công!"},
            status=status.HTTP_200_OK
        )
class ActivityProofViewSet(viewsets.GenericViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):

    queryset = ActivityProof.objects.all()
    serializer_class = ActivityProofSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):

        queryset = ActivityProof.objects.all()

        activity_id = self.request.query_params.get("activity")

        if activity_id:
            queryset = queryset.filter(
                activity_id=activity_id
            )

        return queryset
    def create(self, request, *args, **kwargs):
        activity_id = request.data.get("activity")
        proofDescription = request.data.get("proofDescription")
        if not activity_id:
            return Response(
                {"detail": "Activity is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            activity = Activity.objects.get(
                id=activity_id
            )
        except Activity.DoesNotExist:
            return Response(
                {"detail": "Activity not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        if timezone.now() < activity.end_time:
            return Response(
                {
                    "detail":
                    "Chỉ có thể nộp minh chứng sau khi hoạt động kết thúc."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        registration = ActivityRegistration.objects.filter(
            activity=activity,
            volunteer=request.user,
            register_status=ActivityRegistration.RegistrationStatus.REGISTERED
        ).first()

        if not registration:
            return Response(
                {
                    "detail":
                    "Bạn phải đăng ký hoạt động này mới có thể nộp minh chứng."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
          # Check whether proof already exists
        existing_proof = ActivityProof.objects.filter(
            activity=activity
        ).first()
        if existing_proof:
            # Allow resubmission if rejected
            if existing_proof.status != ActivityProof.ProofStatus.REJECTED:
                return Response(
                    {"detail":"Đại diện đã gửi minh chứng cho hoạt động này."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            existing_proof.description = proofDescription
            existing_proof.status = ActivityProof.ProofStatus.PENDING
            existing_proof.rejection_reason = ""
            existing_proof.reviewed_by = None
            existing_proof.reviewed_at = None
            existing_proof.submitted_by = request.user
            existing_proof.save()
            serializer = self.get_serializer(existing_proof)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        existing_proof = ActivityProof.objects.filter(activity=activity).first()
        if existing_proof:
            if existing_proof.status != ActivityProof.ProofStatus.REJECTED:
                return Response(
                    {"detail":"Đại diện này đã gửi minh chứng cho hoạt động này."},
                    status=status.HTTP_400_BAD_REQUEST)
        proof = ActivityProof.objects.create(
            activity=activity,
            submitted_by=request.user,
            proofDescription=proofDescription
        )
        serializer = self.get_serializer(proof)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        proof = self.get_object()
        activity = proof.activity
        if request.user.role != "leader":
            return Response(
                {"detail": "Chỉ leader mới có thể duyệt minh chứng."},
                status=status.HTTP_403_FORBIDDEN
            )
        if request.user.division != activity.division:
            return Response(
                {"detail": "Bạn không thể duyệt hoạt động này."},
                status=status.HTTP_403_FORBIDDEN
            )
        if proof.status != ActivityProof.ProofStatus.PENDING:
            return Response(
                {"detail": "Minh chứng này đã được xử lý."},
                status=status.HTTP_400_BAD_REQUEST
            )
        proof = self.get_object()
        proof.status = ActivityProof.ProofStatus.APPROVED
        proof.save()
        # Mark the activity as completed
        activity = proof.activity
        ActivityRegistration.objects.filter(activity=activity, register_status=ActivityRegistration.RegistrationStatus.REGISTERED).update(
        register_status=ActivityRegistration.RegistrationStatus.ATTENDED)
        activity.status = Activity.ActivityStatus.COMPLETED
        activity.save(update_fields=["status"])
        return Response({
            "detail": "Minh chứng đã được duyệt. Hoạt động đã hoàn thành."
        })
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):

        proof = self.get_object()
        activity = proof.activity

        if request.user.role != "leader":
            return Response(
                {"detail": "Chỉ leader mới có thể từ chối minh chứng."},
                status=status.HTTP_403_FORBIDDEN
            )
        if request.user.division != activity.division:
            return Response(
                {"detail": "Bạn không thể xử lý minh chứng này."},
                status=status.HTTP_403_FORBIDDEN
            )

        if proof.status != ActivityProof.ProofStatus.PENDING:
            return Response(
                {"detail": "Minh chứng này đã được xử lý."},
                status=status.HTTP_400_BAD_REQUEST
            )

        proof.status = ActivityProof.ProofStatus.REJECTED
        proof.rejection_reason = request.data.get(
            "reason", ""
        )
        proof.save()
        return Response({
            "detail": "Đã từ chối minh chứng."
        })
class ActivityProofImageViewSet(viewsets.ModelViewSet):
    queryset = ActivityProofImage.objects.all()
    serializer_class = ActivityProofImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    