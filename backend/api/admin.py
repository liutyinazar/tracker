from django.contrib import admin
from .models import Task, User, Team, Type, Notification, Chanel

admin.site.register(Task)
admin.site.register(User)


class TeamAdmin(admin.ModelAdmin):
    readonly_fields = ("identifier",)


admin.site.register(Team, TeamAdmin)
admin.site.register(Type)
admin.site.register(Notification)
admin.site.register(Chanel)
