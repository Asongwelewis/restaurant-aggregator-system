from django.shortcuts import redirect
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialTokens, socialaccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@login_required
def google_login_callback(request):
    user =request.user

    social_account = socialaccount.objects.get(user=user)
    print("social account for user:", social_account)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account found for this user.", user)
        return redirect('https://localhost:51573/callback/?error=Nosocialaccountfound')

        token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

        if token:
            print("Google Token found:", token.token)
            # Use the token as needed
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return redirect(f'https://localhost:51573/callback/?access_token={access_token}')
        else:
            print("No token found for this social account.",user)
            return redirect('https://localhost:51573/callback/?error=NoTokenFound')


@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_acces_token:
                return JsonResponse({'detail': 'Token is missing'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)
    return JsonResponse({'detail': 'Method not allowed'}, status=405)

        
            # Validate the token with Google
            
# Create your views here.
