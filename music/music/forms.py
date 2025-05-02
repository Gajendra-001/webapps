# music/forms.py

from django import forms

class MoodForm(forms.Form):
    mood_input = forms.CharField(
        label='How are you feeling?',
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your mood...'})
    )

# music/forms.py

from django import forms
from .models import Song

class SongForm(forms.ModelForm):
    class Meta:
        model = Song
        # Replace 'audio_file' with 'full_audio'
        fields = ['title', 'artist', 'album', 'lyrics', 'mood_tags', 'full_audio']

