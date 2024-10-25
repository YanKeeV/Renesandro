# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /PythonFrontRenesandro

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
