from django.urls import path


from .views import (
    LoginAPIView, RegistrationAPIView, UserRetrieveUpdateAPIView
)

app_name = 'core'
urlpatterns = [
    path('user', UserRetrieveUpdateAPIView.as_view()),
    path('user/registration/', RegistrationAPIView.as_view()),
    path('user/login/', LoginAPIView.as_view()),
]