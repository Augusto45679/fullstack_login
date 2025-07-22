from django.shortcuts import render
from django.contrib.auth.models import User
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response

from base.models import Note
from base.serializer import NoteSerializer, UserSerializer, UserRegistrationsSerializer

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
class CustomTokenObtainPairView(TokenObtainPairView): # Custom view to handle JWT token creation
    
    def post(self, request, *args, **kwargs):
        
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success':True}

            res.set_cookie( #cookie for access token
                key='access_token',
                value=access_token,
                httponly=True,
                samesite='None',
                secure=True,
                path='/'
            )

            res.set_cookie( #cookie for refresh token
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                samesite='None',
                secure=True,
                path='/'
            )

            return res
        except:
            return Response({'success':False})
        

class CustomRefreshTokenView(TokenRefreshView): # Custom view to handle JWT token refresh
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data =  {'refreshed':True}

            res.set_cookie( #cookie for access token
                key='access_token',
                value=access_token,
                httponly=True,
                samesite='None',
                secure=True,
                path='/'
            )

            return res
        except:
            return Response({'refreshed':False})
        

@api_view(['POST'])
def logout(request): #logout 
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success':False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'is_authenticated': True})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request): #user registration
    serializer = UserRegistrationsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notes(request): #para probar permisos
    user = request.user
    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

# def home(request): 
#     return render(request, 'index.html')  

# def logoutGoogle(request):
#     logout(request)
#     return redirect('/') 
