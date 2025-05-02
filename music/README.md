# Music Streaming Django Project

## Overview
This is a Django-based music streaming project that allows users to upload and stream music files.

## Features
- User authentication (login/register)
- Upload and manage songs
- Stream music directly from the platform
- Database storage using SQLite

## Installation
### Prerequisites
- Python 3.x
- Django

### Setup
1. Clone the repository or extract the provided ZIP file.
2. Navigate to the project directory:
   ```sh
   cd music
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Apply database migrations:
   ```sh
   python manage.py migrate
   ```
5. Create a superuser (optional, for admin access):
   ```sh
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```sh
   python manage.py runserver
   ```
7. Access the project at `http://127.0.0.1:8000/`

## Project Structure
```
/music
  |-- manage.py
  |-- db.sqlite3
  |-- media/
      |-- full_songs/  # Stored MP3 files
  |-- <other Django apps>
```

## License
This project is licensed under the MIT License.




