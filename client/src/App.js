import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import ComposerPage from "./pages/ComposerPage";
import Favorites from "./pages/Favorites";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import Playlists from "./pages/Playlists";
import PlaylistPage from "./pages/PlaylistPage";

import { PlayerProvider } from "./context/PlayerContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              
              {/* 🔒 Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/composer/:name" element={<ProtectedRoute><ComposerPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/song/:id" element={<ProtectedRoute><SongPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
              <Route path="/playlist/:id" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;