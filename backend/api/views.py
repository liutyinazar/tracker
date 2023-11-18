from rest_framework import status
from rest_framework.response import Response
from .permissions import IsOwner
from .models import Task, User, Team, Notification, Chanel
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from .serializers import (
    TaskSerializer,
    UserSerializer,
    TeamSerializer,
    UserUpdateSerializer,
    NotificationSerializer,
    UserImageSerializer,
    TeamChanelsSerializer,
    TaskChanelSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404


class UserPhotoUpdate(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, format=None):
        user = request.user  # Получить текущего пользователя

        # Проверить, существует ли поле 'photo' в запросе
        if "photo" in request.data:
            user.photo = request.data["photo"]

            # Сохранить обновленную фотографию пользователя
            user.save()

            return Response(
                {"detail": "Фотография пользователя успешно обновлена"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": 'Поле "photo" не найдено в запросе'},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TaskList(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TeamTasksListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )

    def get_queryset(self):
        team_id = self.kwargs["pk"]

        return Task.objects.filter(by_team_id=team_id)


class UserNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )

    def get_queryset(self):
        user_id = self.kwargs["pk"]
        return Notification.objects.filter(user_id=user_id)


class TeamChanelListView(generics.ListAPIView):
    serializer_class = TeamChanelsSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        return Team.objects.filter(id=pk)


class TeamChanelTaskListView(generics.ListAPIView):
    serializer_class = TaskChanelSerializer

    def get_queryset(self):
        team_pk = self.kwargs["team_pk"]
        channel_pk = self.kwargs["chanel_pk"]
        return Task.objects.filter(team__pk=team_pk, chanel__pk=channel_pk)


class UserNotificationUpdate(generics.UpdateAPIView):
    serializer_class = NotificationSerializer

    def get_object(self):
        user_id = self.kwargs["pk"]
        notification_id = self.kwargs["notification_pk"]
        return get_object_or_404(Notification, user_id=user_id, id=notification_id)


class UserNotificationViewDestroy(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )

    def destroy(self, request, *args, **kwargs):
        try:
            notification = self.get_object()
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class TaskUpdate(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class TaskDestroy(generics.RetrieveDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class UserPhoto(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserImageSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )
    lookup_field = "pk"


class UserUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class UserDestroy(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class UserTeamsList(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )

    def get_queryset(self):
        user_id = self.kwargs.get("pk")
        # Знайдіть команди, до яких належить користувач
        user_teams = Team.objects.filter(users=user_id)
        return user_teams


class UserDetail(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )

    def get_queryset(self):
        user_id = self.kwargs.get("pk")
        queryset = User.objects.filter(pk=user_id)
        return queryset


class TeamList(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    # permission_classes = (IsAuthenticated,)


class TeamUpdate(generics.RetrieveUpdateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


class TeamDestroy(generics.RetrieveDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )
