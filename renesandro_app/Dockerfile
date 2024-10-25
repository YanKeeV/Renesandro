# Backend Dockerfile
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /renesandro_app

RUN apt update && apt install ffmpeg -y 

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN python -m spacy download en_core_web_sm

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]