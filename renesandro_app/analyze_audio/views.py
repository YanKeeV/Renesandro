from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Audio
from django.core.files.storage import default_storage
from .serializers import AudioSerializer
import json

from .utils import analyze_audio_and_generate_prompts

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_audio(request):

    if 'audio_file' not in request.FILES:
        return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

    audio_file = request.FILES['audio_file']

    audio_path = 'media/' + default_storage.save(f'audio_files/{audio_file.name}', audio_file)

    prompts = analyze_audio_and_generate_prompts(audio_path)

    serializer_data = {
        'title': audio_file.name,
        'audio_url': audio_path,
        'user': request.user.pk,
        'prompts': prompts
    }

    serializer = AudioSerializer(data=serializer_data)
    if serializer.is_valid(raise_exception=True):
        audio = serializer.save()

    return Response({"message": "Audio uploaded successfully", "audio_id": audio.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audio(request, pk=None):
    if pk is not None:
        try:
            audio = Audio.objects.get(id=pk, user=request.user)
            serializer = AudioSerializer(audio)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Audio.DoesNotExist:
            return Response({"error": "Audio not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        audio_list = Audio.objects.filter(user=request.user)
        serializer = AudioSerializer(audio_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_audio(request):

    title = request.data.get('title')
    prompts_str = request.data.get('prompts', '[]')
    prompts = [p.strip() for p in prompts_str.split(',')]

    if 'audio_file' not in request.FILES:
        return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

    audio_file = request.FILES['audio_file']

    audio_path = 'media/' + default_storage.save(f'audio_files/{audio_file.name}', audio_file)

    serializer_data = {
        'title': title,
        'audio_url': audio_path,
        'user': request.user.pk,
        'prompts': prompts
    }

    serializer = AudioSerializer(data=serializer_data)
    if serializer.is_valid(raise_exception=True):
        audio = serializer.save()

    return Response({"message": "Audio uploaded successfully", "audio_id": audio.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_audio(request, pk):
    try:
        audio = Audio.objects.get(id=pk, user=request.user)
    except Audio.DoesNotExist:
        return Response({"error": "Audio not found"}, status=status.HTTP_404_NOT_FOUND)
    
    title = request.data.get('title')
    prompts_data = request.data.get('prompts', None)
    
    if title:
        audio.title = title

    if prompts_data:
        prompts = prompts_data
        audio.prompts = prompts

    audio.save()

    return Response({"message": "Audio updated successfully", "audio_id": audio.id}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def batch_update_audio(request):
    data = request.data

    if not isinstance(data, list):
        return Response({"error": "Expected a list of objects"}, status=status.HTTP_400_BAD_REQUEST)

    for item in data:
        audio_id = item.get('id')
        title = item.get('title', None)
        prompts_data = item.get('prompts', None)

        try:
            audio = Audio.objects.get(id=audio_id, user=request.user)
        except Audio.DoesNotExist:
            return Response({"error": f"Audio with id {audio_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        if title:
            audio.title = title

        if prompts_data:
            try:
                prompts = json.loads(prompts_data) if isinstance(prompts_data, str) else prompts_data
            except json.JSONDecodeError:
                return Response({"error": f"Invalid JSON for prompts in audio {audio_id}"}, status=status.HTTP_400_BAD_REQUEST)
            audio.prompts = prompts

        audio.save()

    return Response({"message": "Batch update successful"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_audio(request, pk):
    try:
        audio = Audio.objects.get(id=pk)
        audio.delete()
        return Response({"message": "Audio deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Audio.DoesNotExist:
        return Response({"error": "Audio not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def batch_delete_audio(request):
    audio_ids = request.data.get('ids', [])
    deleted_count = Audio.objects.filter(id__in=audio_ids).delete()
    return Response({"message": f"Deleted {deleted_count[0]} audio files"}, status=status.HTTP_204_NO_CONTENT)
