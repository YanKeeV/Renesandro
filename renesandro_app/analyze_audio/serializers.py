from rest_framework import serializers
from .models import Audio

class AudioSerializer(serializers.ModelSerializer):
    prompts = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Audio
        fields = ['pk', 'title', 'audio_url', 'prompts', 'user']

    def create(self, validated_data):
        prompts_data = validated_data.pop('prompts')

        audio = Audio.objects.create(prompts=prompts_data, **validated_data)
        
        return audio
