from django.urls import path
from analyze_audio import views

app_name = 'analyze_audio'
urlpatterns = [
    path('upload/', views.upload_audio, name='upload-audio'),

    path('', views.get_audio, name='audio-list'),

    path('<int:pk>', views.get_audio, name='single-audio'),

    path('create/', views.create_audio, name='audio-create'),

    path('update/<int:pk>', views.update_audio, name='audio-update'),

    path('batch-update/', views.batch_update_audio, name='batch_update_audio'),

    path('delete/<int:pk>/', views.delete_audio, name='audio-destroy'), 

    path('batch-delete/', views.batch_delete_audio, name='batch_delete_audio'), 
]