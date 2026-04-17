import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { queue, removeFromQueue, playFromQueue, playNext, currentQueueIndex, isPlaying, togglePlay, currentSong } = useContext(PlayerContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2>Genres</h2>
      </div>

      <ul className="nav-links">
        <li 
          className={`sidebar-link ${location.pathname === '/' ? 'active-nav' : ''}`} 
          onClick={() => navigate("/")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/' ? "var(--accent-bright)" : "currentColor"}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span style={{ color: location.pathname === '/' ? "white" : "inherit" }}>Genres</span>
        </li>
        <li 
          className={`sidebar-link ${location.pathname === '/carnatic' ? 'active-nav' : ''}`} 
          onClick={() => navigate("/carnatic")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/carnatic' ? "var(--accent-bright)" : "currentColor"}>
            <path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3z" />
          </svg>
          <span style={{ color: location.pathname === '/carnatic' ? "white" : "inherit" }}>Carnatic</span>
        </li>
        <li 
          className={`sidebar-link ${location.pathname === '/pop' ? 'active-nav' : ''}`} 
          onClick={() => navigate("/pop")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/pop' ? "var(--accent-bright)" : "currentColor"}>
            <path d="M12 2 2 7l10 5 10-5-10-5zm0 9-10-5v11l10 5 10-5V6l-10 5z" />
          </svg>
          <span style={{ color: location.pathname === '/pop' ? "white" : "inherit" }}>Pop</span>
        </li>
        <li 
          className={`sidebar-link ${location.pathname === '/search' ? 'active-nav' : ''}`} 
          onClick={() => navigate("/search")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/search' ? "var(--accent-bright)" : "currentColor"}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span style={{ color: location.pathname === '/search' ? "white" : "inherit" }}>Search</span>
        </li>
        <li 
          className={`sidebar-link ${location.pathname === '/favorites' ? 'active-nav' : ''}`} 
          onClick={() => navigate("/favorites")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/favorites' ? "var(--accent-bright)" : "currentColor"}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span style={{ color: location.pathname === '/favorites' ? "white" : "inherit" }}>Favorites</span>
        </li>
        <li 
          className={`sidebar-link ${location.pathname.startsWith('/playlist') ? 'active-nav' : ''}`} 
          onClick={() => navigate("/playlists")} 
          style={{ cursor: "pointer" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname.startsWith('/playlist') ? "var(--accent-bright)" : "currentColor"}>
            <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z" />
          </svg>
          <span style={{ color: location.pathname.startsWith('/playlist') ? "white" : "inherit" }}>Playlists</span>
        </li>
        {user && (
          <li 
            className={`sidebar-link ${location.pathname === '/profile' ? 'active-nav' : ''}`} 
            onClick={() => navigate("/profile")} 
            style={{ cursor: "pointer" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={location.pathname === '/profile' ? "var(--accent-bright)" : "currentColor"}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span style={{ color: location.pathname === '/profile' ? "white" : "inherit" }}>My Profile</span>
          </li>
        )}
      </ul>

      <div className="sidebar-queue">
        <div className="queue-header">
          <h3>Queue</h3>
          {queue.length > 0 && currentQueueIndex < queue.length - 1 && (
            <button className="play-queue-btn" onClick={playNext} title="Play next in queue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-secondary)">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <p className="empty-queue">Your queue is empty.</p>
        ) : (
          <ul className="queue-list">
            {queue.map((song, index) => {
              const isActive = currentSong && (currentSong._id === song._id || (currentSong.mbid && currentSong.mbid === song.mbid));
              return (
              <li
                key={index}
                className={`queue-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(`/song/${song.songId || song.mbid || song._id}`)}
              >
                <div className="queue-info">
                  <span className="queue-title">{song.title}</span>
                </div>
                {isActive && (
                  <div className="queue-controls">
                    <button className="queue-play-toggle" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                      {isPlaying ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-secondary)">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-secondary)">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div className={`now-playing-indicator ${!isPlaying ? 'paused' : ''}`}>
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <button
                  className="remove-queue-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(index);
                  }}
                  title="Remove from queue"
                >
                  &times;
                </button>
              </li>
            )})}
          </ul>
        )}

        {/* 👤 User Status */}
        <div className="user-section" style={{ marginTop: "auto", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ 
                  width: "36px", height: "36px", borderRadius: "50%", 
                  background: "var(--accent-secondary)", display: "flex", 
                  alignItems: "center", justifyContent: "center", fontWeight: "800", color: "#010409"
                }}>
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "600", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {user.name || "User"}
                  </p>
                </div>
              </div>
              <button 
                onClick={logout}
                style={{ 
                  background: "rgba(255,75,75,0.1)", color: "#ff4b4b", border: "1px solid rgba(255,75,75,0.2)",
                  padding: "8px 12px", borderRadius: "10px", cursor: "pointer", transition: "0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,75,75,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,75,75,0.1)"}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="sidebar-link" style={{ 
              background: "rgba(14, 165, 233, 0.1)", color: "var(--accent-bright)", 
              padding: "12px 16px", borderRadius: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;