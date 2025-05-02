# music/admin.py

from django.contrib import admin
from .models import Song

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'mood_tags')
    search_fields = ('title', 'artist', 'lyrics', 'mood_tags')
