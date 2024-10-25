from django.db import models
from core.models import User

class Audio(models.Model):
    title = models.CharField(max_length=255)
    audio_url = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    prompts = models.JSONField()

    def __str__(self) -> str:
        return self.title
