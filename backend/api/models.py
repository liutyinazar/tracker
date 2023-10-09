import random, string
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Team(models.Model):
    identifier = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=80)
    image = models.ImageField(upload_to="assets/team_image", null=True, blank=True)
    users = models.ManyToManyField("User")

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
    photo = models.ImageField(upload_to="assets/user_photo", null=True, blank=True)
    groups = models.ManyToManyField(Group, related_name="custom_user_groups")
    user_permissions = models.ManyToManyField(
        Permission, related_name="custom_user_permissions"
    )


class Task(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    date_created = models.DateField(auto_now_add=True)
    date_start = models.DateTimeField()
    date_finish = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, default=1
    )
