from django.db import models
from api.models import BaseModel

class Campaign(BaseModel):
    id = models.AutoField(primary_key=True)
    campaignYear = models.IntegerField(unique=True,blank=False, null=False)
    campaignStartDate = models.DateTimeField(blank=False, null=False)
    campaignEndDate = models.DateTimeField(blank=False, null=False)
    def __str__(self):
        return f"Mùa Hè Xanh {self.campaignYear}"