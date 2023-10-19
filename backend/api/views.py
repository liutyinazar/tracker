from .permissions import IsOwner
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .models import Task, User, Team, Type
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .serializers import (
    TaskSerializer,
    UserSerializer,
    TeamSerializer,
    TypeSerializer,
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
    serializer_class = UserSerializer
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
    permission_classes = (IsAuthenticated,)


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


class SignUp(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    extra_kwargs = {
        "password": {"write_only": True},  # NOT RETURN PASSWORD!
    }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.set_password(serializer.validated_data["password"])
        user.save()

        return Response(
            {"detail": "User registered successfully."}, status=status.HTTP_201_CREATED
        )


class Login(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class Logout(APIView):
    def post(self, request):
        # Отримання токену з тіла POST-запиту
        token = request.data.get("token")

        if token:
            try:
                # Знайдення токену в базі даних та його видалення
                token_obj = Token.objects.get(key=token)
                token_obj.delete()
            except Token.DoesNotExist:
                pass

            # Розлогінення користувача
            logout(request)

            return Response(
                {"detail": "Logged out successfully."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Token not provided."}, status=status.HTTP_400_BAD_REQUEST
            )
