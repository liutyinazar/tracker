from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from api.views import (
    TaskUpdate,
    TaskDestroy,
    UserList,
    TeamUpdate,
    TeamDestroy,
    UserUpdate,
    UserDestroy,
    UserDetail,
    UserTeamsList,
    TeamTasksListView,
    UserNotificationListView,
    UserNotificationViewDestroy,
    UserPhoto,
    UserPhotoUpdate,
    UserNotificationUpdate,
    TeamChannelListView,
    TeamChannelTaskListView,
    CommentList,
)

urlpatterns = [
    # ADMINS
    path("admin/", admin.site.urls),
    # TASKS
    path("api/v1/tasks/<int:pk>/", TaskUpdate.as_view()),
    path("api/v1/tasks/delete/<int:pk>/", TaskDestroy.as_view()),
    # COMMENTS
    path("api/v1/comment/", CommentList.as_view()),
    # USERS
    path("api/v1/users/", UserList.as_view()),
    path("api/v1/users/<int:pk>/", UserUpdate.as_view()),
    path("api/v1/users/delete/<int:pk>/", UserDestroy.as_view()),
    path("api/v1/users/detail/<int:pk>/", UserDetail.as_view(), name="user-details"),
    path("api/v1/users/<int:pk>/photo/", UserPhoto.as_view()),
    path("api/v1/update_photo/", UserPhotoUpdate.as_view(), name="user-photo-update"),
    # TEAMS
    path("api/v1/teams/<int:pk>/", TeamUpdate.as_view()),
    path("api/v1/teams/delete/<int:pk>/", TeamDestroy.as_view()),
    path(
        "api/v1/users/<int:pk>/teams/", UserTeamsList.as_view(), name="user-teams-list"
    ),
    path("api/v1/teams/<int:pk>/tasks/", TeamTasksListView.as_view()),
    path("api/v1/teams/<int:pk>/channel/", TeamChannelListView.as_view()),
    path(
        "api/v1/teams/<int:team_pk>/channel/<int:channel_pk>/",
        TeamChannelTaskListView.as_view(),
        name="team-channel-list",
    ),
    # NOTIFICATIONS
    path("api/v1/users/<int:pk>/notifications/", UserNotificationListView.as_view()),
    path(
        "api/v1/users/<int:pk>/notifications/<int:notification_pk>/update/",
        UserNotificationUpdate.as_view(),
    ),
    path(
        "api/v1/users/<int:pk>/notifications/<int:notification_id>/delete/",
        UserNotificationViewDestroy.as_view(),
        name="delete-user-notification",
    ),
    # AUTH
    path("auth/", include("djoser.urls")),
    re_path(r"^auth/", include("djoser.urls.authtoken")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
