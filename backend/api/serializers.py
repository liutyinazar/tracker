import re
from rest_framework import serializers
from .models import Task, User, Team, Notification, Chanel


def is_valid_email(email):
    return re.match(r"^[\w\.-]+@[\w\.-]+$", email)


class ChanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chanel
        fields = "__all__"


class TeamChanelsSerializer(serializers.ModelSerializer):
    chanels = ChanelSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ["chanels"]


class TeamSerializer(serializers.ModelSerializer):
    chanels = ChanelSerializer(many=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "identifier",
            "name",
            "image",
            "users",
            "chanels",
        )


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["photo"]



class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
        )

        read_only_fields = (
            "username",
            "photo",
            "password",
        )

class TaskChanelSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    for_users = UserTaskSerializer(many=True)

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
            "for_users",
        )

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




class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    team = TeamSerializer()
    for_users = UserSerializer(many=True)
    # chanel = ChanelSerializer(many=True)

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
            "team",
            "for_users",
            "chanel",
        )


class NotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%d.%m.%y %H:%M")

    class Meta:
        model = Notification
        fields = ("id", "message", "task", "user", "created_at", "is_read")
