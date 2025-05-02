from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post, Room, RoomFile, RoomMessage
from django.db.models import Q
from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.staticfiles.views import serve

# ---------------------- Original Views ------------------------

def home(request):
    context = {
        'posts': Post.objects.all()
    }
    return render(request, 'blog/home.html', context)

def search(request):
    template = 'blog/home.html'
    query = request.GET.get('q')
    result = Post.objects.filter(Q(title__icontains=query) | Q(author__username__icontains=query) | Q(content__icontains=query))
    context = {'posts': result}
    return render(request, template, context)

def getfile(request):
    return serve(request, 'File')

class PostListView(ListView):
    model = Post
    template_name = 'blog/home.html'
    context_object_name = 'posts'
    ordering = ['-date_posted']
    paginate_by = 2

class UserPostListView(ListView):
    model = Post
    template_name = 'blog/user_posts.html'
    context_object_name = 'posts'
    paginate_by = 2

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Post.objects.filter(author=user).order_by('-date_posted')

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    template_name = 'blog/post_form.html'
    fields = ['title', 'content', 'file']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    template_name = 'blog/post_form.html'
    fields = ['title', 'content', 'file']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    success_url = '/'
    template_name = 'blog/post_confirm_delete.html'

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})

# ---------------------- Room Feature Views ------------------------

@login_required
def create_room(request):
    if request.method == 'POST':
        room_id = request.POST.get('room_id')
        password = request.POST.get('password')
        if Room.objects.filter(room_id=room_id).exists():
            messages.error(request, "Room ID already exists.")
            return redirect('create-room')
        room = Room.objects.create(room_id=room_id, password=password, created_by=request.user)
        room.members.add(request.user)
        messages.success(request, f"Room '{room_id}' created successfully!")
        return redirect('room-detail', room_id=room.room_id)
    return render(request, 'blog/create_room.html')

@login_required
def join_room(request):
    if request.method == 'POST':
        room_id = request.POST.get('room_id')
        password = request.POST.get('password')
        room = get_object_or_404(Room, room_id=room_id)
        if room.password != password:
            messages.error(request, "Incorrect password.")
            return redirect('join-room')
        if request.user in room.members.all():
            messages.info(request, "You are already a member of this room.")
            return redirect('room-detail', room_id=room.room_id)
        room.members.add(request.user)
        messages.success(request, f"Joined room '{room_id}' successfully!")
        return redirect('room-detail', room_id=room.room_id)
    return render(request, 'blog/join_room.html')

@login_required
def room_detail(request, room_id):
    room = get_object_or_404(Room, room_id=room_id)
    if request.user not in room.members.all():
        raise PermissionDenied
    files = RoomFile.objects.filter(room=room)
    messages = RoomMessage.objects.filter(room=room).order_by('-timestamp')  # Get chat messages
    context = {
        'room': room,
        'files': files,
        'messages': messages  # Pass messages to template
    }
    return render(request, 'blog/room_detail.html', context)

@login_required
def upload_file(request, room_id):
    room = get_object_or_404(Room, room_id=room_id)
    if request.user not in room.members.all():
        raise PermissionDenied
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        RoomFile.objects.create(
            room=room,
            file=uploaded_file,
            uploaded_by=request.user
        )
        messages.success(request, "File uploaded successfully!")
        return redirect('room-detail', room_id=room.room_id)
    return render(request, 'blog/upload_file.html', {'room': room})

@login_required
def user_rooms(request):
    rooms = request.user.rooms_joined.all()
    return render(request, 'blog/user_rooms.html', {'rooms': rooms})

@login_required
def send_message(request, room_id):
    room = get_object_or_404(Room, room_id=room_id)
    if request.user not in room.members.all():
        messages.error(request, "You are not a member of this room.")
        return redirect('room-detail', room_id=room.room_id)

    if request.method == 'POST':
        content = request.POST.get('content')
        message = RoomMessage.objects.create(room=room, sender=request.user, content=content)
        
        # Return JSON response with the new message
        return JsonResponse({
            'user': message.sender.username,
            'message': message.content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
