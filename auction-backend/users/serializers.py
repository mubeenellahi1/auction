from django.contrib.sites.shortcuts import get_current_site
from .tokens import account_activation_token
from users.utils import email_confirmation_email
from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    """Serializer for creating user"""
    confirm_password = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone_number', 'name', 'password', 'confirm_password','gender','birthday','is_seller')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }

    def create(self, validated_data):
        """Function to create user"""
        if validated_data['password'] == validated_data['confirm_password']:
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                phone_number=validated_data['phone_number'],
                name=validated_data['name'],
                gender=validated_data['gender'],
                birthday=validated_data['birthday'],
                is_seller=validated_data['is_seller']
                
            )
            user.set_password(validated_data['password'])
            user.save()
            return user
        else:
            raise Exception('Password do not match')
        
    