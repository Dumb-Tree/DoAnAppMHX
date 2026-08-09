from django.db import models
from api.models import BaseModel

class Campaign(BaseModel):
    id = models.AutoField(primary_key=True)
    campaignName = models.CharField(max_length=50, blank=False, null=False)
    campaignYear = models.IntegerField(blank=False, null=False)
    campaignStartDate = models.DateField(blank=False, null=False)
    campaignEndDate = models.DateField(blank=False, null=False)
    def __str__(self):
        return self.campaignName