from rest_framework_simplejwt.authentication import JWTAuthentication

class CookiesJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that uses cookies for access and refresh tokens.
    """

    def get_jwt_value(self, request):
        """
        Override to get JWT from cookies instead of headers.
        """
        access_token = request.COOKIES.get('access_token')
        if access_token:
            return access_token
        return None

    def get_refresh_jwt_value(self, request):
        """
        Override to get refresh JWT from cookies instead of headers.
        """
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            return refresh_token
        return None
    
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None
        
        validated_token = self.get_validated_token(access_token)

        try:
            user = self.get_user(validated_token)
        except:
            return None
    
        return (user,validated_token)