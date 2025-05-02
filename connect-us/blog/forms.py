from django import forms
from .models import Room, Post

# 🔹 Create Room Form
class CreateRoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['room_id', 'password']
        widgets = {
            'password': forms.PasswordInput()
        }

# 🔹 Join Room Form
class JoinRoomForm(forms.Form):
    room_id = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

# 🔹 Post Upload Form (used inside a room)
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'file', 'content']
