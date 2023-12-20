import random, string
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Channel(models.Model):
    title = models.CharField(max_length=58)

    def __str__(self):
        return self.title


class Team(models.Model):
    identifier = models.CharField(max_length=10, unique=True, blank=True, null=True)
    name = models.CharField(max_length=80)
    image = models.ImageField(upload_to="assets/team_image")
    users = models.ManyToManyField("User")
    channels = models.ManyToManyField(Channel, blank=True, related_name="team_channel")

    def __str__(self):
        return self.name

    def generate_identifier(self):
        generator = "".join(
            random.choice(string.ascii_letters + string.digits) for _ in range(8)
        ).upper()
        self.identifier = f"#{generator}"

    def save(self, *args, **kwargs):
        if not self.identifier:
            self.generate_identifier()
        super(Team, self).save(*args, **kwargs)


class User(AbstractUser):
    photo = models.ImageField(
        upload_to="assets/user_photo",
        null=True,
        blank=True,
        default="./assets/images/default_user.png",
    )
    groups = models.ManyToManyField(Group, related_name="custom_user_groups")
    user_permissions = models.ManyToManyField(
        Permission, related_name="custom_user_permissions"
    )

    def __str__(self):
        return self.username


class Task(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    date_created = models.DateField(auto_now_add=True)
    date_start = models.DateTimeField()
    date_finish = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        null=True,
        default=1,
        related_name="created_tasks",
    )
    team = models.ForeignKey("Team", on_delete=models.SET_NULL, null=True)
    for_users = models.ManyToManyField(
        "User", blank=True, related_name="assigned_tasks"
    )
    channel = models.ForeignKey("Channel", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.message}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.message}"