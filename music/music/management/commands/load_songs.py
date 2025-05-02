# music/management/commands/load_songs.py

import csv
from django.core.management.base import BaseCommand
from music.models import Song

class Command(BaseCommand):
    help = "Load songs from a CSV file. The CSV should have columns: title, artist, album, lyrics, mood_tags, audio_file (optional)."

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to the CSV file.')

    def handle(self, *args, **options):
        file_path = options['file']
        if not file_path:
            self.stdout.write(self.style.ERROR("Please provide a CSV file path using --file"))
            return

        with open(file_path, encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                song, created = Song.objects.get_or_create(
                    title=row['title'],
                    artist=row['artist'],
                    album=row.get('album', ''),
                    lyrics=row['lyrics'],
                    mood_tags=row['mood_tags'],
                )
                # If there's an audio_file field provided, you might need to copy the file to your media folder.
                if row.get('audio_file'):
                    song.audio_file = row['audio_file']
                song.save()
        self.stdout.write(self.style.SUCCESS("Songs loaded successfully!"))
