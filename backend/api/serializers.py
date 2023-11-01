from rest_framework import serializers
from .models import Task, User, Team, Type, Notification
import re


def is_valid_email(email):
    return re.match(r"^[\w\.-]+@[\w\.-]+$", email)


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ("id", "identifier", "name", "image", "users")


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["photo"]


class UserSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True, read_only=True, source="team_set")

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "teams",
        )

        read_only_fields = (
            "username",
            "photo",
            "password",
        )

    def validate(self, attrs):
        # Додайте логіку перевірки, наприклад, перевірку складності пароля або валідацію електронної пошти
        if not is_valid_email(attrs["email"]):
            raise serializers.ValidationError({"email": "Невірна пошта"})

        if len(attrs["password"]) < 8:
            raise serializers.ValidationError({"password": "Пароль занадто простий"})

        username = attrs["username"]
        # Перевірка, чи користувач з таким username вже існує
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"username": "Користувач з таким іменем вже існує"}
            )

        return attrs


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "photo",
            "username",
            "password",
        )


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ("id", "type")


class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    by_team = TeamSerializer()
    for_users = UserSerializer(many=True)

    class Meta:
        model = Task
        fields = (
            "title",
            "description",
            "date_created",
            "date_start",
            "date_finish",
            "is_completed",
            "created_by",
            "by_team",
            "for_users",
        )


class NotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%d.%m.%y %H:%M")

    class Meta:
        model = Notification
        fields = ("message", "task", "user", "created_at")
