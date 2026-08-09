from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ["id","hoTen","created_date","active"]
    readonly_fields = ["image_view"]
    def image_view(self, BacSi):
        if BacSi.image:
            return mark_safe(f'<img src="/static/{User.image.name}" width="200" />')
        
admin.site.register(User)