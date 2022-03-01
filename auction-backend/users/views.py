from base64 import urlsafe_b64decode
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.utils.encoding import force_text
from users.models import *
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.serializers import *
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site

User = get_user_model()


# Create your views here.
class SignUpApiViewSet(viewsets.ModelViewSet):
    """Handle Registering new users"""
    queryset = User.objects.all()
    serializer_class = SignUpSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        try:
            if request.data.get("email") and User.objects.filter(email=request.data.get("email")):
                return Response({
                    "status": "failure",
                    "message": "Email already exist",
                    "data": ""})

            elif request.data.get("username") and User.objects.filter(username=request.data.get("username")):
                return Response({
                    "status": "failure",
                    "message": "Username already exist",
                    "data": ""})
            
            result =super().create(request, *args, **kwargs)
            user=User.objects.get(email=request.data.get("email"))
            current_site = get_current_site(request)
            token= account_activation_token.make_token(user)
            verificationemail =email_confirmation_email(user,token,current_site)
            
            return Response({
                "status": "success",
                "message": "User has been created ",
                "data": result.data
            })
        
        except Exception as e:
            return Response({
                "status": "failure",
                "message": "User has not created - " + str(e),
                "data": ""
            },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLoginApiView(ObtainAuthToken):
    """Handle creating user authentication tokens"""

    def post(self, request, *args, **kwargs):
        try:
            queryset = User.objects.filter(
                Q(username=request.data.get("username")) | Q(email=request.data.get("username")))
            if len(queryset):
                if not queryset[0].check_password(request.data.get("password")):
                    return Response({
                        "status": "failure",
                        "message": "Invalid Password",
                        "data": ""}, 
                                    status=status.HTTP_401_UNAUTHORIZED)
                if queryset[0].is_active == False:
                    return Response({
                        "status": "failure",
                        "message": "User is Deactivated",
                        "data": ""}, 
                                    status=status.HTTP_401_UNAUTHORIZED)

                response = super().post(request, *args, **kwargs)
                token = Token.objects.get(key=response.data['token'])
                queryset = User.objects.get(id=token.user_id)

                return Response({
                    "status": "success", 
                    "messege ": "User Log in", 
                    "data": {'token': token.key, 'uuid': queryset.uuid, 'email': queryset.email, 'phone_number': queryset.phone_number,
                                                                                          'username': queryset.username, 'name': queryset.name,  'birthday': queryset.birthday, 'gender': queryset.gender,'coins': queryset.coins,'is_seller': queryset.is_seller}
                    })
            return Response({
                "status": "Failure",
                "message": "Invalid username/email",
                "data":""
                             },
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                "status": "Failure",
                "message": "Login failed - " + str(e) ,
                "data":""},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserFacebookLoginApiView(ObtainAuthToken):
    """Handle login and signup for facebook """

    def post(self, request, *args, **kwargs):
        try:

            queryset = User.objects.filter(
                Q(email=request.data.get("email")))
            print(queryset)
            if len(queryset):
                if queryset[0].facebook_token != request.data.get("facebook_token"):
                    return Response({
                        "status":"failure",
                        "message": "Invalid Token",
                        "data":""}, 
                                    status=status.HTTP_401_UNAUTHORIZED)

                token, created = Token.objects.get_or_create(user=queryset[0])
                queryset = User.objects.get(id=token.user_id)
                return Response({
                    "status": "success",
                    "message": "User login successfully",
                    "data": {"token":token.key, 'uuid': queryset.uuid, 'email': queryset.email, 'username': queryset.username, 'phone_number': queryset.phone_number,
                                 'name': queryset.name, 'birthday': queryset.birthday, 'gender': queryset.gender}
                    })

            else:

                firstname = request.data.get('first_name')
                lastname = request.data.get('last_name')
                name = firstname + ' ' + lastname

                user = User.objects.create(
                    first_name=firstname,
                    last_name=lastname,
                    name=name,
                    username=request.data.get('email'),
                    email=request.data.get('email'),
                    facebook_token=request.data.get('facebook_token'),
                )

                user.save()
                current_site = get_current_site(request)
                token= account_activation_token.make_token(user)
                verificationemail =email_confirmation_email(user,token,current_site)

                token, created = Token.objects.get_or_create(user=user)
                queryset = User.objects.get(id=token.user_id)

                return Response({
                    "status": "success",
                    "message": "user signup successfully", 
                    "data":{'token': token.key, 'uuid': queryset.uuid, 'email': queryset.email, 'username': queryset.username, 'phone_number': queryset.phone_number,
                    'name': queryset.name, 'birthday': queryset.birthday, 'gender': queryset.gender}
                    })

        except Exception as e:
            return Response({
                "status": "Failure",
                "message": "Login failed - " + str(e),
                "data":""}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserGoogleLoginApiView(ObtainAuthToken):
    """Handle login and signup for Google"""

    def post(self, request, *args, **kwargs):
        try:

            queryset = User.objects.filter(
                Q(email=request.data.get("email")))
            if len(queryset):
                if queryset[0].gmail_token != request.data.get("google_token"):
                    return Response({
                        "status":"failure",
                        "message": "Invalid Token",
                        "data":""}, 
                                    status=status.HTTP_401_UNAUTHORIZED)

                token, created = Token.objects.get_or_create(user=queryset[0])
                queryset = User.objects.get(id=token.user_id)
                return Response({
                    "status": "success",
                    "message": "User login successfully",
                    "data":  {"token":token.key, 'uuid': queryset.uuid, 'email': queryset.email, 'username': queryset.username, 'phone_number': queryset.phone_number,
                                 'name': queryset.name, 'birthday': queryset.birthday, 'gender': queryset.gender}
                    })

            else:

                firstname = request.data.get('first_name')
                lastname = request.data.get('last_name')
                name = firstname + ' ' + lastname

                user = User.objects.create(
                    first_name=firstname,
                    last_name=lastname,
                    name=name,
                    username=request.data.get('email'),
                    email=request.data.get('email'),
                    gmail_token=request.data.get('google_token'),
                )

                user.save()
                current_site = get_current_site(request)
                token= account_activation_token.make_token(user)
                verificationemail =email_confirmation_email(user,token,current_site)

                token, created = Token.objects.get_or_create(user=user)
                queryset = User.objects.get(id=token.user_id)

            return Response({"status": "success",
                             "message": "user signup successfully", 
                             "data":{'token': token.key, 'uuid': queryset.uuid, 'email': queryset.email, 'username': queryset.username, 'phone_number': queryset.phone_number,
                                 'name': queryset.name, 'birthday': queryset.birthday, 'gender': queryset.gender}
                             })

        except Exception as e:
            return Response({
                "status": "Failure",
                "message": "Login failed - " + str(e),
                "data":""}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class addcoins(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    
    def add(self, request):
        try:
            user=request.user
            coins=request.data.get("coins")
            user.coins=int(user.coins)+int(coins)
            user.save()
          
            
            return Response({
                "status":"success",
                'Message':'coins are added',
                'data':{"coins":user.coins}
                })
        except Exception as e:
            return Response({
                "status":"failure",
                "message": "Request cannot be proceeded- " + str(e),
                'data':{""}
                },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
def ActivateAccount(request,token,uuid):
    try:
        user = User.objects.get(uuid=uuid)
        if user.email_verified ==True :
            message='Your email already  verified'
            return render(request,'email_verification.html',{'message':message})
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.email_verified = True
        user.save()
        message='your email has been verified'
        return render(request,'email_verification.html',{'message':message})
    else:
        message='Link has been expired or is invalid'
        return render(request,'email_verification.html',{'message':message})
    

class BecomeASeller(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        try:
            user=request.user
            if user.email_verified == True:
                phone_number=request.data.get("phone_number")
                home_address=request.data.get("home_address")
                city=request.data.get("city")
                bank_name=request.data.get("bank_name")
                account_title=request.data.get("account_title")
                account_number=request.data.get("account_number")
                
                user.phone_number=phone_number
                user.is_seller=True
                user.save()
                
                AdressUser.objects.create(street=home_address,city=city,user=user)
                UserBankInfo.objects.create(bank_name=bank_name,account_title=account_title,account_number=account_number,user=user)
                return Response({
                    "status":"success",
                    'Message':'User Became a Seller',
                    'data':""
                    })
            else:   
                current_site = get_current_site(request)
                token= account_activation_token.make_token(user)
                verificationemail =email_confirmation_email(user,token,current_site)

                return Response({
                        "status": "failure",
                        "message": "User Email is not verified. Verification email has been sent " ,
                        "data": ""
                     })
  
        except Exception as e:
            return Response({
                "status": "failure",
                "message": "seller has not created - " + str(e),
                "data": ""
            },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    
    
    
