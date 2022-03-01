from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import uuid
# import os
# from django.utils.timezone import now


class TimeStampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    name = models.CharField(blank=True, max_length=255)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=500, unique=True)
    email_verified = models.BooleanField(default=False)
    phone_regex = RegexValidator(
        regex=r'^\+?\d{8,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(
        validators=[phone_regex], max_length=15, blank=True)

    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES,blank=True, null=True)

    birthday = models.DateField(blank=True, null=True)
    is_seller = models.BooleanField(default=False)
    facebook_token = models.CharField(max_length=2048,blank=True, null=True)
    gmail_token = models.CharField(max_length=2048,blank=True, null=True)
    coins = models.FloatField(blank=True, null=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username


class AdressUser(TimeStampMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=150, null=True, blank=True)
    state = models.CharField(max_length=150, null=True, blank=True)
    postal_code = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.user.name


class UserBankInfo(TimeStampMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    bank_name = models.CharField(max_length=100)
    account_title = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20)
    CVV = models.CharField(max_length=4, null=True, blank=True)

    def __str__(self):
        return self.user.username
