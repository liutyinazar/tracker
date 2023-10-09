from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


from api.views import TaskList, UserList, TeamList

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/tasks/", TaskList.as_view()),
    path("api/v1/users/", UserList.as_view()),
    path("api/v1/teams/", TeamList.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
