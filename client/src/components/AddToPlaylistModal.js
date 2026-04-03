import { useEffect, useState } from "react";
import axios from "axios";

function AddToPlaylistModal({ song, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get("http://localhost:5000/playlists");
        setPlaylists(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAdd = async (playlistId) => {
    setLoading(true);
    try {
      if (!song) throw new Error("No song data");
      // Standardize payload
      const payload = {
         ...song,
         songId: song.songId || song._id || song.mbid
      };
      await axios.post(`http://localhost:5000/playlists/${playlistId}/songs`, payload);
      alert("Added to playlist!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add to playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-card)", padding: "24px", borderRadius: "16px",
        minWidth: "320px", maxWidth:"90%", color: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "20px" }}>Add to Playlist</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer", fontSize: "20px", width:"30px", height:"30px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>&times;</button>
        </div>
        
        {playlists.length === 0 ? (
          <p style={{ color: "#aaa" }}>No playlists available. Create one first from the Playlists menu!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {playlists.map(pl => (
              <li key={pl._id}>
                <button 
                  disabled={loading}
                  onClick={() => handleAdd(pl._id)}
                  style={{
                    width: "100%", padding: "12px 16px", textAlign: "left",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                    color: "white", cursor: "pointer", fontSize: "16px", transition: "0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  {pl.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddToPlaylistModal;
