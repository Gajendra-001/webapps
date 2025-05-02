from django.urls import path
from . import views  # Import views module to use search, about, and other views
from .views import (
    PostListView,
    PostDetailView,
    PostCreateView,
    PostUpdateView,
    PostDeleteView,
    UserPostListView,
    create_room,
    join_room,
    room_detail,
    upload_file,
    user_rooms,
    send_message,  # New view for handling chat messages
)

urlpatterns = [
    # Blog post views
    path('', PostListView.as_view(), name='blog-home'),
    path('user/<str:username>/', UserPostListView.as_view(), name='user-posts'),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('post/new/', PostCreateView.as_view(), name='post-create'),
    path('post/<int:pk>/update/', PostUpdateView.as_view(), name='post-update'),
    path('post/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('search/', views.search, name='search'),  # Ensure search view is defined in views.py
    path('about/', views.about, name='blog-about'),  # Ensure about view is defined in views.py

    # Room feature URLs
    path('room/create/', create_room, name='create-room'),
    path('room/join/', join_room, name='join-room'),
    path('room/<str:room_id>/', room_detail, name='room-detail'),
    path('room/<str:room_id>/upload/', upload_file, name='upload-file'),
    path('your-rooms/', user_rooms, name='your-rooms'),
    path('room/<str:room_id>/send_message/', send_message, name='send-message'),  # New URL for chat
]
