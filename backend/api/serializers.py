import re
from rest_framework import serializers
from .models import Task, User, Team, Notification, Channel, Comment


def is_valid_email(email):
    return re.match(r"^[\w\.-]+@[\w\.-]+$", email)


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class TeamChannelsSerializer(serializers.ModelSerializer):
    channels = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ["channels"]


class TeamSerializer(serializers.ModelSerializer):
    channels = ChannelSerializer(many=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "identifier",
            "name",
            "image",
            "users",
            "channels",
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


class TaskChannelSerializer(serializers.ModelSerializer):
    # created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_by = UserSerializer()
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
    # channel = ChannelSerializer(many=True)

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
            "channel",
        )


class NotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%d.%m.%y %H:%M")

    class Meta:
        model = Notification
        fields = ("id", "message", "task", "user", "created_at", "is_read")


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    task = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    channel = ChannelSerializer()
    created_at = serializers.DateTimeField(format="%d.%m.%y %H:%M")

    class Meta:
        model = Comment
        fields = ("id", "user", "task", "channel", "team", "message", "created_at")

    def get_user(self, obj):
        data = {
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
        }
        return data

    def get_task(self, obj):
        data = {
            "title": obj.task.title,
        }
        return data

    def get_team(self, obj):
        data = {
            "name": obj.team.name,
        }
        return data
