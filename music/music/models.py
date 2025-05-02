# music/models.py

from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200, blank=True)
    lyrics = models.TextField()
    mood_tags = models.CharField(
        max_length=200,
        help_text="Comma-separated mood tags (e.g., happy, sad, relaxed)"
    )
    # Field for streaming the full song
    full_audio = models.FileField(upload_to='full_songs/', blank=True, null=True)
    # Optional preview file
    preview_file = models.FileField(upload_to='previews/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"
