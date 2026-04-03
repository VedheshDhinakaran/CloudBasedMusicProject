import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SongCard from "../components/SongCard";
import { PlayerContext } from "../context/PlayerContext";

function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist } = useContext(PlayerContext);
  const [playlist, setPlaylist] = useState(null);

  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/playlists/${id}`);
      setPlaylist(res.data);
    } catch (err) {
      console.error("Failed to fetch playlist", err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete(`http://localhost:5000/playlists/${id}/songs/${songId}`);
      fetchPlaylist();
    } catch (err) {
      console.error("Failed to remove song", err);
    }
  };

  if (!playlist) return <div style={{padding:"20px", color:"white"}}>Loading playlist...</div>;

  return (
    <div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <h2 style={{ margin: 0 }}>🎧 {playlist.name}</h2>
          {playlist.songs.length > 0 && (
            <button 
              onClick={() => playPlaylist(playlist.songs)} 
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", 
                backgroundColor: "var(--accent-bright)", color: "white", 
                border: "none", borderRadius: "24px", cursor: "pointer", fontSize: "16px", fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(255, 60, 60, 0.3)", transition: "0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="m8 5 10 7-10 7z" />
              </svg>
              Play All
            </button>
          )}
        </div>

      <div className="grid">
        {playlist.songs.map((song) => (
          <div key={song._id || song.songId || song.mbid} style={{ position: "relative" }}>
            <SongCard
              song={song}
            />
            <button 
               onClick={(e) => { e.stopPropagation(); handleRemoveSong(song._id || song.songId || song.mbid); }} 
               style={{ position: "absolute", top: "10px", right: "45px", zIndex: 10, background:"rgba(0,0,0,0.7)", borderRadius:"50%", color:"white", border:"none", width:"32px", height:"32px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", transition: "0.2s" }}
               title="Remove from Playlist"
               onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,0,0,0.8)"}
               onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
            >
               &times;
            </button>
          </div>
        ))}
      </div>
      {playlist.songs.length === 0 && <p style={{ color: "#aaa", marginTop: "20px" }}>This playlist is empty. Browse songs to add some!</p>}
    </div>
  );
}
export default PlaylistPage;
