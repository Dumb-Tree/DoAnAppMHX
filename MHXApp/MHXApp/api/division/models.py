from django.db import models
from api.models import BaseModel
from ..users.models import User
# Create your models here.
class Division(BaseModel):
    id = models.AutoField(primary_key=True)
    divisionName = models.CharField(max_length=50, blank=False, null=False)
    divisionDescription = models.TextField()
    
    def __str__(self):
        return self.divisionName
    
class DivisionRegistration(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'pending'
        APPROVED = 'approved'
        REJECTED = 'rejected'
        CANCELLED = 'cancelled'
    id = models.AutoField(primary_key=True)
    RegisterDate = models.DateTimeField(auto_now_add=True)
    Reason = models.TextField()
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='registrations',null=False, blank=False, default=None)
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations_volunteer',null=False, blank=False, default=None)
    Status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    def __str__(self):
        return f"{self.division.divisionName} - {self.volunteer.first_name} {self.volunteer.last_name}"

