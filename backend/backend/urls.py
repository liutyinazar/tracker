from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


from api.views import (
    TaskList,
    TaskUpdate,
    TaskDestroy,
    UserList,
    TeamList,
    TeamUpdate,
    TeamDestroy,
    TypeList,
    UserUpdate,
    UserDestroy,
    Login,
    SignUp,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/tasks/", TaskList.as_view()),
    path("api/v1/tasks/<int:pk>", TaskUpdate.as_view()),
    path("api/v1/tasks/delete/<int:pk>", TaskDestroy.as_view()),
    path("api/v1/users/", UserList.as_view()),
    path("api/v1/users/<int:pk>", UserUpdate.as_view()),
    path("api/v1/users/delete/<int:pk>", UserDestroy.as_view()),
    path("api/v1/teams/", TeamList.as_view()),
    path("api/v1/teams/<int:pk>", TeamUpdate.as_view()),
    path("api/v1/teams/delete/<int:pk>", TeamDestroy.as_view()),
    path("api/v1/types/", TypeList.as_view()),
    path("sign-in/", SignUp.as_view(), name="register"),
    path("login/", Login.as_view(), name="login"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
