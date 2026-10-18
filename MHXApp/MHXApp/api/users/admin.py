from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe

from .models import User

# Register your models here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = [
        "id",
        "username",
        "MSSV",
        "email",
        "role",
        "division",
        "is_active",
    ]

    fieldsets = UserAdmin.fieldsets + (
        ("MHX Information", {
            "fields": (
                "MSSV",
                "role",
                "division",
                "avatar",
                "image_view",
            ),
        }),
    )

    readonly_fields = ["image_view"]

    def image_view(self, obj):
        if obj.avatar:
            return mark_safe(
                f'<img src="{obj.avatar.url}" width="200" />'
            )
        return "No image"
        
    image_view.short_description = "Avatar"