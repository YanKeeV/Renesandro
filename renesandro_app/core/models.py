from django.db import models
import jwt
from datetime import datetime, timedelta
from django.conf import settings 
from django.contrib.auth.models import (
	AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models

class UserManager(BaseUserManager):

    def create_user(self, name, surname, email, password=None):

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(name=name, surname=surname, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, name, surname, email, password):
        
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(name, surname, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    
    name = models.CharField(max_length=255)

    surname = models.CharField(max_length=255)

    email = models.EmailField(db_index=True, unique=True)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname']

    objects = UserManager()

    def __str__(self):
        
        return self.email

    @property
    def token(self):
       
        return self._generate_jwt_token()

    def get_full_name(self):
        
        return self.name + ' ' + self.surname

    def get_short_name(self):
        
        return self.name

    def _generate_jwt_token(self):
        
        dt = datetime.now() + timedelta(days=5)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token