import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SongCard from "../components/SongCard";
import { PlayerContext } from "../context/PlayerContext";

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [recent, setRecent] = useState([]);
  const { setCurrentSong } = useContext(PlayerContext);

  const refreshHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/search");
      setRecent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Load recent songs history from DB
  useEffect(() => {
    refreshHistory();
  }, []);

  // ✅ Search function (local DB first, then MusicBrainz metadata fallback)
  const handleSearch = async (q) => {
    setQuery(q);

    if (!q) {
      setSongs([]);
      return;
    }

    try {
      const localRes = await axios.get(`http://localhost:5000/songs?title=${encodeURIComponent(q)}`);

      if (localRes.data && localRes.data.length > 0) {
        setSongs(localRes.data);
      } else {
        setSongs([]);
      }
    } catch (err) {
      console.error(err);
      setSongs([]);
    }
  };

  // ✅ Play recent song and bump into history
  const playRecentSong = async (item) => {
    setCurrentSong(item);

    try {
      await axios.post("http://localhost:5000/search", {
        songId: item.songId || item._id,
        title: item.title,
        composer: item.composer,
        raga: item.raga,
      });

      await refreshHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-page">
      <h1>Search</h1>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          placeholder="Search for songs or ragas..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "16px 20px 16px 48px",
            borderRadius: "30px",
            width: "100%",
            fontSize: "16px",
            outline: "none",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "0.3s"
          }}
          onFocus={(e) => e.target.style.background = "rgba(255,255,255,0.12)"}
          onBlur={(e) => e.target.style.background = "rgba(255,255,255,0.08)"}
        />
      </div>

      {!query && (
        <>
          {/* 🕘 Recently Played */}
          <h2>Recently Played</h2>
          <div className="recent-list">
            {recent.length === 0 ? (
              <p>No recently played songs yet. Play something to fill this list.</p>
            ) : (
              recent.map((item) => (
                <div 
                  key={item._id} 
                  className="song-card small" 
                  onClick={() => navigate(`/song/${item.songId || item.mbid || item._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="overlay" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", padding: "10px", gap: "10px" }}>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await axios.delete(`http://localhost:5000/search/${item._id}`);
                          setRecent((prev) => prev.filter((i) => i._id !== item._id));
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      title="Remove from history"
                      style={{ 
                        background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%",
                        color: "white", cursor: "pointer", width: "36px", height: "36px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "0.2s", backdropFilter: "blur(4px)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#ff4b4b"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <button 
                      className="play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playRecentSong(item);
                      }} 
                      title="Play"
                      style={{ 
                        background: "var(--accent-bright)", border: "none", borderRadius: "50%", 
                        width: "36px", height: "36px", display: "flex", alignItems: "center", 
                        justifyContent: "center", cursor: "pointer", transition: "0.2s",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="m8 5 10 7-10 7z" />
                      </svg>
                    </button>
                  </div>

                  <h3>{item.title}</h3>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* 🎵 Results */}
      {query && (
        <div className="grid">
          {songs.length > 0 ? (
            songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onHistoryUpdate={refreshHistory}
                onPlay={() => {
                  setQuery("");
                  setSongs([]);
                }}
              />
            ))
          ) : (
            <p>No songs found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;