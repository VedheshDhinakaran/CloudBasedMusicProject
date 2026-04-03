import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import { PlayerContext } from "../context/PlayerContext";
import { AuthContext } from "../context/AuthContext";
import { findBestYoutubeVideo } from "../utils/youtubeHelper";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

function SongPage() {
  const { currentSong, setCurrentSong, currentVideo, setCurrentVideo, addToQueue } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState("");
  const [aiInsights, setAiInsights] = useState(null); // ✅ NEW
  const [loadingAI, setLoadingAI] = useState(false); // ✅ NEW
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/songs/${id}`);
        const foundSong = res.data;
        setSong(foundSong);
        setCurrentSong(foundSong);

        const token = localStorage.getItem("token");
        const favRes = await axios.get("http://localhost:5000/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const exists = favRes.data.some(
          (fav) => fav.title === foundSong.title && fav.composer === foundSong.composer
        );
        setIsFavorite(exists);

        const recs = await axios.get(`http://localhost:5000/songs/recommend/${id}`);
        setRecommendations(recs.data);

        // only load YouTube if not already loaded for this song
        if (!currentVideo || currentSong?._id !== foundSong._id) {
          setYtError("");
          setYtLoading(true);
          const video = await findBestYoutubeVideo(foundSong);
          setCurrentVideo(video);
          if (!video) setYtError("No matching YouTube video found.");
          setYtLoading(false);
        }
      } catch (err) {
        console.error("Could not fetch song", err);
      }
    };

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/ai/insights/${id}`);
        setAiInsights(res.data);
      } catch (err) {
        console.error("AI Insights failed", err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchSong();
    fetchAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);



  if (!song) return <p>Loading...</p>;

  const audioUrl = song.audio || null;
  const isThisCurrentSong = currentSong && (currentSong._id === song._id || currentSong.mbid === song.mbid);
  const activeVideo = isThisCurrentSong ? currentVideo : null;

  const playSong = async () => {
    setCurrentSong(song);
    setYtError("");

    try {
      // Use the same prioritized singer logic
      const video = await findBestYoutubeVideo(song);
      setCurrentVideo(video);

      if (!video && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Audio play failed", err);
        }
      }

      if (!video) {
        setYtError("No YouTube match found, playing local audio if available.");
      }
    } catch (err) {
      console.error("Play action failed", err);
      setYtError("Unable to search YouTube at this time.");
    }

    try {
      await axios.post("http://localhost:5000/search", {
        songId: song._id || song.mbid,
        title: song.title,
        composer: song.composer,
        raga: song.raga,
        source: song.mbid ? "musicbrainz" : "local",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/favorites", {
        songId: song._id,
        title: song.title,
        raga: song.raga,
        composer: song.composer,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(true);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/favorites", {
        params: { title: song.title, composer: song.composer },
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="song-detail-page">
      <h1>{song.title}</h1>
      <p><span style={{ color: "var(--accent-secondary)" }}>Raga:</span> {song.raga}</p>
      <p><span style={{ color: "var(--accent-secondary)" }}>Tala:</span> {song.tala}</p>
      <p><span style={{ color: "var(--accent-secondary)" }}>Composer:</span> {song.composer}</p>

      <div className="song-actions">
        <button className="play-btn" onClick={playSong} title="Play">
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6zm8-14v14h4V5z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="m8 5 10 7-10 7z" />
            </svg>
          )}
        </button>
        <button
          className="heart-btn"
          onClick={isFavorite ? removeFromFavorites : addToFavorites}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff4b4b">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </button>
        <button
          className="add-to-queue-btn"
          onClick={() => addToQueue(song)}
          title="Add to Queue"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => setShowPlaylistModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", 
            backgroundColor: "rgba(255,255,255,0.05)", color: "var(--accent-secondary)", 
            border: "1px solid var(--accent-secondary)", borderRadius: "20px", cursor: "pointer", 
            fontSize: "14px", fontWeight: "bold", marginLeft: "10px", transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-secondary)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "var(--accent-secondary)";
          }}
          title="Add to Playlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add to Playlist
        </button>
      </div>

      {/* ✨ AI Insights Section */}
      <div className="ai-insights-container">
        <div className="ai-header">
          <div className="ai-badge">AI INSIGHTS 🧠</div>
          <h2 className="ai-title">Discover the Soul</h2>
        </div>
        
        {loadingAI ? (
          <div className="ai-loading">
            <div className="ai-pulse"></div>
            <p>Gathering musical pearls...</p>
          </div>
        ) : aiInsights ? (
          <div className="ai-grid">
            <div className="ai-card story">
              <h3>📜 The Story</h3>
              <p>{aiInsights.story}</p>
            </div>
            <div className="ai-card beauty">
              <h3>💎 The Beauty</h3>
              <p>{aiInsights.beauty}</p>
            </div>
          </div>
        ) : (
          <div className="ai-empty">
            <p>Insights currently unavailable for this composition.</p>
          </div>
        )}
      </div>

      {ytLoading && <p>Finding best match on YouTube...</p>}
      {ytError && <p style={{ color: "var(--accent-bright)" }}>{ytError}</p>}

      {activeVideo ? (
        <div className="youtube-embed">
          <h3>Now playing from YouTube:</h3>
          <iframe
            title="youtube-player"
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <p>{activeVideo.title}</p>
          <img src={activeVideo.thumbnail} alt="yt thumbnail" style={{ maxWidth: "160px", marginTop: "8px" }} />
        </div>
      ) : audioUrl ? (
        <audio
          ref={audioRef}
          controls
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <p>Audio preview not available for this song.</p>
      )}

      <p>Duration: {song.durationMs ? Math.floor(song.durationMs / 1000) + " sec" : "Unknown"}</p>
      <p>Type: {song.type || "unknown"}</p>
      {song.releases && song.releases.length > 0 && (
        <div>
          <p>Releases:</p>
          <ul>
            {song.releases.map((r) => (
              <li key={r.id || r.title}>{r.title || r.id}</li>
            ))}
          </ul>
        </div>
      )}



      <h2>Recommended Songs</h2>
      <div className="grid">
        {recommendations.map((r) => (
          <SongCard
            key={r._id}
            song={r}
            onHistoryUpdate={async () => {
              /* Optional: Keep recent history up-to-date if needed */
            }}
          />
        ))}
      </div>
      
      {showPlaylistModal && (
        <AddToPlaylistModal 
          song={song} 
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}

export default SongPage;