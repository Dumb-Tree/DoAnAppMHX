from django.contrib import admin
from .models import Activity, ActivityRegistration,ActivityProof,ActivityProofImage
# Register your models here.
admin.site.register(Activity)
admin.site.register(ActivityRegistration)
admin.site.register(ActivityProof)
admin.site.register(ActivityProofImage)