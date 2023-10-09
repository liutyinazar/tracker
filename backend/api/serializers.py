from rest_framework import serializers
from .models import Task, User, Team


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            "title",
            "description",
            "date_created",
            "date_start",
            "date_finish",
            "is_completed",
            "created_by_id",
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "photo")


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ("id", "identifier", "name", "image", "users")
