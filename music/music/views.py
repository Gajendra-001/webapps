# music/views.py

from django.shortcuts import render
from django.http import JsonResponse
from .forms import MoodForm
from .models import Song

def index(request):
    form = MoodForm()
    return render(request, 'music/index.html', {'form': form})

def recommend_songs(request):
    """
    View that filters songs from the local database based on mood tags.
    """
    if request.method == 'POST':
        mood_input = request.POST.get('mood_input', '')
        mood_keywords = mood_input.lower().split()
        songs = Song.objects.all()
        # Filter songs where any mood keyword is present in the mood_tags field
        filtered_songs = [
            song for song in songs
            if any(keyword in song.mood_tags.lower() for keyword in mood_keywords)
        ]
        # Fallback to all songs if no matches are found
        if not filtered_songs:
            filtered_songs = list(songs)

        song_list = []
        for song in filtered_songs:
            song_list.append({
                'title': song.title,
                'artist': song.artist,
                'album': song.album,
                'lyrics': song.lyrics,
                'mood_tags': song.mood_tags,
                # Use the full_audio file URL for streaming the full song
                'audio_url': song.full_audio.url if song.full_audio else '',
            })
        return JsonResponse({'songs': song_list})
    return JsonResponse({'error': 'Invalid request'}, status=400)
