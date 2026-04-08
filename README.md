# 🎵 Carnatic Music Streaming & Discovery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Cloud-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)

A premium, modern web application dedicated to the discovery and streaming of Carnatic music. This platform connects enthusiasts with traditional compositions through a modern interface, featuring AI-powered recommendations, playlist management, and seamless YouTube integration.

---

## 🚀 Features

- **Personalized Music Discovery**: Search for songs by Raga, Composer, or Name.
- **AI-Powered Recommendations**: Intelligent suggestions based on user listening habits and musical properties.
- **Smart Queue & Playlists**: Create, manage, and share your favorite Carnatic collections.
- **Global Search**: Dedicated search page for finding specific krithis and compositions.
- **YouTube Integration**: High-relevance video playback for every song.
- **User Authentication**: Secure login and profile setup with personalized greetings.
- **Glassmorphic UI**: A modern, premium aesthetic with dynamic animations and responsive design.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **Context API**: Global state management for Authentication and Music Player.
- **Vanilla CSS**: Premium styling with glassmorphism and custom animations.
- **Axios**: Seamless API communication.

### Backend
- **Node.js & Express**: Robust server-side architecture.
- **MongoDB & Mongoose**: Scalable NoSQL database with structured schemas.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Transformers.js**: AI capabilities for semantic analysis and recommendations.

---

## 📂 Project Structure & File Documentation

### 🖥️ Client (Frontend) `/client`

#### 📂 `src/components`
- `AddToPlaylistModal.js`: UI for adding songs to existing or new playlists.
- `Layout.js`: Wrapper component providing consistent navigation and structure.
- `Player.js`: The central music player controller with playback logic.
- `ProtectedRoute.js`: Middleware component to restrict access to authenticated users.
- `SearchBar.js`: Interactive search input with real-time suggestions.
- `Sidebar.js`: Primary navigation menu with glassmorphic styling.
- `SongCard.js`: Detailed song display component for lists and search results.
- `VideoPlayer.js`: YouTube embed handler for video playback.

#### 📂 `src/context`
- `AuthContext.js`: Manages user session, login, and registration states.
- `PlayerContext.js`: Manages global playback state, queue, and current song.

#### 📂 `src/pages`
- `Home.js`: Dashboard featuring trending compositions and personalized greetings.
- `ComposerPage.js`: Dedicated view for exploring songs by specific composers.
- `SongPage.js`: Comprehensive view for individual songs with detailed information.
- `SearchPage.js`: Robust search interface for the entire library.
- `Playlists.js` & `PlaylistPage.js`: Management and detailed view of user playlists.
- `LoginPage.js` & `ProfileSetup.js`: User onboarding and authentication flow.

#### 📂 `src/utils`
- `youtubeHelper.js`: Logic for generating optimized YouTube search queries based on Carnatic music context.

---

### ⚙️ Server (Backend) `/server_NodeBackend`

#### 📂 `routes`
- `authRoutes.js`: Handles user signup, login, and profile management.
- `songRoutes.js`: API endpoints for fetching and filtering song data.
- `playlistRoutes.js`: CRUD operations for user-created playlists.
- `favoriteRoutes.js`: Logic for managing user's favorite tracks.
- `aiRoutes.js`: Endpoints for AI-driven recommendations.
- `youtubeRoutes.js`: Integration with YouTube API for fetching video links.
- `queueRoutes.js`: Manages the user's active play queue.

#### 📂 `models`
- `User.js`: Schema for user profiles and credentials.
- `Song.js`: Detailed schema for Carnatic compositions (Raga, Tala, Composer).
- `Playlist.js`: Structure for user-generated collections.
- `Favorite.js`: Mapping for user-song favoriting.
- `VideoCache.js`: Optimization layer to store YouTube links and reduce API calls.

#### 📂 `utils`
- `aiService.js`: Integration with `Transformers.js` for recommendation logic.
- `jsonPersistence.js`: Helper for persistent file-based caching and data imports.

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- A MongoDB Atlas cluster or local MongoDB instance.

### 1. Clone the Repository
```bash
git clone https://github.com/VedheshDhinakaran/CloudBasedMusicNonsense.git
cd CloudBasedMusicNonsense
```

### 2. Backend Setup
```bash
cd server_NodeBackend
npm install
```
Create a `.env` file in the `server_NodeBackend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run the Application
**Start Backend:**
```bash
cd server_NodeBackend
npm start
```
**Start Frontend:**
```bash
cd client
npm start
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Team
* Vedhesh
* Lakshmipriya
* Janhavi
* Keerthi
