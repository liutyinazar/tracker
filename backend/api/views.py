from .permissions import IsOwner
from .models import Task, User, Team, Type
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .serializers import (
    TaskSerializer,
    UserSerializer,
    TeamSerializer,
    TypeSerializer,
    UserUpdateSerializer,
)


class TaskList(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


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


class UserUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    # permission_classes = (
    #     IsAdminUser,
    #     IsOwner,
    # )



class UserDestroy(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (
        IsAdminUser,
        IsOwner,
    )


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


class TypeList(generics.ListAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
