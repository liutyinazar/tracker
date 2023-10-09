from django.contrib import admin
from .models import Task, User, Team

admin.site.register(Task)
admin.site.register(User)


class TeamAdmin(admin.ModelAdmin):
    readonly_fields = ("identifier",)


admin.site.register(Team, TeamAdmin)
