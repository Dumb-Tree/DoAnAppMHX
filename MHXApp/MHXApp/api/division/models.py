from django.db import models
from api.models import BaseModel
from ..users.models import User
from cloudinary.models import CloudinaryField
# Create your models here.
class Division(BaseModel):
    id = models.AutoField(primary_key=True)
    divisionName = models.CharField(max_length=50, blank=False, null=False)
    divisionDescription = models.TextField()
    picture = CloudinaryField(null=True)
    
    
    def __str__(self):
        return self.divisionName
    
class DivisionRegistration(BaseModel):
    class RegistrationStatus(models.TextChoices):
        PENDING = 'pending'
        APPROVED = 'approved'
        REJECTED = 'rejected'
        CANCELLED = 'cancelled'
    id = models.AutoField(primary_key=True)
    RegisterDate = models.DateTimeField(auto_now_add=True)
    reason = models.TextField()
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='registrations',null=False, blank=False, default=None)
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations_volunteer',null=False, blank=False)
    Status = models.CharField(max_length=20, choices=RegistrationStatus.choices, default=RegistrationStatus.PENDING)
    def __str__(self):
        return f"{self.division.divisionName} - {self.volunteer.first_name} {self.volunteer.last_name}"

