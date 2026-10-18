from django.db import models
from api.models import BaseModel
from ..users.models import User
from ..division.models import Division
from ..campaign.models import Campaign
from cloudinary.models import CloudinaryField
# Create your models here.
class Activity(BaseModel):
    id = models.AutoField(primary_key=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='activities')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE,related_name="activitiesCampaign")
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)
    location = models.CharField(max_length=50, default="",null=False)
    
    def __str__(self):
        return self.name
    
    class ActivityStatus(models.TextChoices):
        UPCOMING = 'Upcoming', 'Upcoming'
        ONGOING = 'ongoing', 'Ongoing'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
    status = models.CharField(max_length=10,choices=ActivityStatus.choices, default=ActivityStatus.UPCOMING)
    
class ActivityRegistration(models.Model):
    activity = models.ForeignKey(Activity,on_delete=models.CASCADE,related_name='registrations')
    volunteer = models.ForeignKey(User,on_delete=models.CASCADE,related_name='activity_registrations')
    register_time = models.DateTimeField(auto_now_add=True)
    class RegistrationStatus(models.TextChoices):
        REGISTERED = 'registered', 'Registered'
        CANCELLED = 'cancelled', 'Cancelled'
        ATTENDED = 'attended', 'Attended'
        ABSENT = 'absent', 'Absent'

    register_status = models.CharField(max_length=20,choices=RegistrationStatus.choices,default=RegistrationStatus.REGISTERED)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['activity', 'volunteer'],
                name='unique_activity_volunteer'
            )
        ]
    def __str__(self):
        return f"{self.activity.name} - {self.volunteer.first_name} {self.volunteer.last_name}"
    
class ActivityProof(models.Model):
    class ProofStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
    activity = models.OneToOneField(Activity,on_delete=models.CASCADE,related_name='proof')
    proofDescription = models.TextField()
    status = models.CharField(max_length=20,choices=ProofStatus.choices,default=ProofStatus.PENDING)
    rejection_reason = models.TextField(blank=True,default="")
    submitted_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name='activity_proofs')
    
    def __str__(self):
        return f"{self.activity.name}"
    
class ActivityProofImage(models.Model):

    proof = models.ForeignKey(ActivityProof,on_delete=models.CASCADE,related_name='images')
    image = CloudinaryField("image")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.proof.activity.name}"

