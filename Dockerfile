FROM node:18-bullseye as builder

# 1. Build Frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# Create .env for build (Public Keys Only)
RUN echo "VITE_FIREBASE_API_KEY=AIzaSyDjZ5fxBFibryTueJvUgvG7pDamGqyHwbk" > .env
RUN echo "VITE_FIREBASE_AUTH_DOMAIN=lost2found-66698.firebaseapp.com" >> .env
RUN echo "VITE_FIREBASE_PROJECT_ID=lost2found-66698" >> .env
RUN echo "VITE_FIREBASE_STORAGE_BUCKET=lost2found-66698.firebasestorage.app" >> .env
RUN echo "VITE_FIREBASE_MESSAGING_SENDER_ID=246647655293" >> .env
RUN echo "VITE_FIREBASE_APP_ID=1:246647655293:web:fc17401bf09c6bebe49a14" >> .env
RUN echo "VITE_FIREBASE_MEASUREMENT_ID=G-HYZ81F6GF9" >> .env
RUN npm run build

# 2. Setup Backend & Python Environment
FROM node:18-bullseye

# Install Python 3.10 and pip
RUN apt-get update && apt-get install -y python3.10 python3.10-venv python3-pip

WORKDIR /app

# Copy Backend
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install
COPY Backend/ ./Backend/

# Copy Frontend Build from Stage 1
COPY --from=builder /app/frontend/dist ./frontend/dist

# Setup AI Service
WORKDIR /app/AIML
COPY AIML/requirements.txt .
# Create venv to avoid conflicts
RUN python3.10 -m venv venv
RUN ./venv/bin/pip install --no-cache-dir -r requirements.txt
COPY AIML/ .

# Return to Root
WORKDIR /app

# Create Start Script
RUN echo '#!/bin/bash\n\
# Start AI Service (Background)\n\
cd /app/AIML\n\
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Wait for AI Service\n\
sleep 5\n\
\n\
# Start Backend (Main Process)\n\
cd /app/Backend\n\
export PORT=7860\n\
export AI_SERVICE_URL=http://127.0.0.1:8000\n\
node server.js\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose Hugging Face Port
EXPOSE 7860

CMD ["/app/start.sh"]
