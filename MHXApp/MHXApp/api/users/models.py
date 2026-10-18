from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser, UserManager
# Create your models here.

class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("role") is not User.Role.ADMIN:
            raise ValueError("Superuser must have role=ADMIN.")

        return super().create_superuser(username, email, password, **extra_fields)

class User(AbstractUser):
    avatar = CloudinaryField(null=True)
    class Role(models.TextChoices):
        ADMIN = 'admin'
        VOLUNTEER = 'volunteer'
        LEADER = 'leader'
        
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VOLUNTEER,
        blank=False,
    )
    MSSV = models.CharField(max_length=10, blank=False, null=False, unique=True)
    division = models.ForeignKey('division.Division', on_delete=models.SET_NULL, null=True, blank=True, default=None)
    
    objects = CustomUserManager()
        
def __str__(self):
        return f"{self.username} - ({self.role})"