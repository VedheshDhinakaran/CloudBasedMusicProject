# 🎵 Carnatic Music Streaming & Discovery Platform

A modern web application for discovering and streaming Carnatic music with playlists, recommendations, and YouTube integration.

---

## ✅ What’s included

- Full React frontend in `/client`
- Express + MongoDB backend in `/server_NodeBackend`
- Kubernetes manifests in `/k8s/app.yaml`
- Local Docker Compose stack using `docker-compose.yml`

---

## 🚀 Prerequisites

- Node.js installed
- Docker Desktop installed
- Kubernetes enabled in Docker Desktop (if using Kubernetes)
- `kubectl` installed and configured for the local cluster
- A YouTube API key
- Optional: a MongoDB connection string for external DB usage

---

## 🔧 Backend Environment

Create `server_NodeBackend/.env` with:

```env
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=your_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
```

> If you deploy with Kubernetes, the YouTube API key will be provided via a Kubernetes secret instead of `.env`.

---

## ▶️ Option 1: Run with Docker Compose (Easiest)

1. From repository root:

```bash
docker compose up --build
```

2. Open the app:

```text
http://localhost:3000
```

### Notes
- Frontend runs at `http://localhost:3000`
- Backend runs at `http://localhost:5000`
- MongoDB runs as part of the compose stack

---

## ▶️ Option 2: Run with Kubernetes (Recommended)

### 1. Build the images

```bash
docker build -t music-backend:latest ./server_NodeBackend
docker build -t music-frontend:latest ./client
```

### 2. Create the YouTube API secret

```bash
kubectl delete secret youtube-api-key --ignore-not-found
kubectl create secret generic youtube-api-key \
  --from-literal=YOUTUBE_API_KEY='your_youtube_api_key'
```

### 3. Deploy the Kubernetes stack

```bash
kubectl apply -f k8s/app.yaml
```

### 4. Forward the frontend to localhost

```bash
kubectl port-forward svc/frontend 8080:80
```

Open:

```text
http://localhost:8080
```

### 5. Optional: test the backend directly

```bash
kubectl port-forward svc/backend 5000:5000
curl http://localhost:5000/songs
```

---

## 👩‍💻 Local Development

### Backend only

```bash
cd server_NodeBackend
npm install
npm start
```

### Frontend only

```bash
cd client
npm install
npm start
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Troubleshooting

### `localhost:8080` won’t connect

Make sure the frontend port-forward is still running:

```bash
kubectl port-forward svc/frontend 8080:80
```

### YouTube videos show unavailable

- Make sure `YOUTUBE_API_KEY` is configured.
- For Kubernetes, ensure the `youtube-api-key` secret exists.
- Restart the backend after updating the secret.
- Check backend logs:

```bash
kubectl logs deployment/backend -f
```

### No songs appear

- Verify backend connectivity to MongoDB.
- Seed the database manually if required:

```bash
kubectl exec -it $(kubectl get pods -l app=backend -o jsonpath='{.items[0].metadata.name}') -- node data/importData.js
```

---

## 📌 Recommended Shared Setup

For a reproducible shareable setup, use Kubernetes with Docker Desktop:

1. Build the backend and frontend images
2. Create `youtube-api-key` secret
3. Apply `k8s/app.yaml`
4. Port-forward `frontend` to `localhost:8080`

This is the most reliable way to share the working configuration.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
