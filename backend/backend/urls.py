from django.contrib import admin
from django.urls import include, path, re_path
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
    UserDetail,
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
    path("api/v1/users/detail/<int:pk>/", UserDetail.as_view(), name="user-details"),
    path("auth/", include("djoser.urls")),
    re_path(r"^auth/", include("djoser.urls.authtoken")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
