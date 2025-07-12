from rest_framework import serializers
from .models import Note, User

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'description', 'owner']
        read_only_fields = ['owner']  # Assuming owner is set automatically, e.g., by the view or serializer context

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Adjust fields as necessary
        read_only_fields = ['id']  # Assuming id is set automatically by Django

class UserRegistrationsSerializer(serializers.ModelSerializer): #registration
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user