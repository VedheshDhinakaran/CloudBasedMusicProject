import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get("http://localhost:5000/playlists");
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      await axios.post("http://localhost:5000/playlists", { name: newPlaylistName });
      setNewPlaylistName("");
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to create playlist", err);
      alert("Error creating playlist: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this playlist?")) return;
    try {
      await axios.delete(`http://localhost:5000/playlists/${id}`);
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleRename = async (id, currentName, e) => {
    e.stopPropagation();
    const newName = window.prompt("Enter new playlist name:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;

    try {
      await axios.put(`http://localhost:5000/playlists/${id}`, { name: newName });
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to rename", err);
      alert("Error renaming playlist: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>🎧 Your Playlists</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={newPlaylistName} 
          onChange={(e) => setNewPlaylistName(e.target.value)} 
          placeholder="New Playlist Name" 
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "var(--bg-card)", color: "white", flex: 1, maxWidth: "300px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "var(--accent-bright)", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>Create</button>
      </form>
      
      <div className="grid">
        {playlists.map(pl => (
          <div key={pl._id} onClick={() => navigate(`/playlist/${pl._id}`)} style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", cursor: "pointer", position: "relative", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <h3 style={{ margin: "0 0 10px 0", paddingRight: "50px" }}>{pl.name}</h3>
            <p style={{ margin: 0, color: "#aaa" }}>{pl.songs.length} songs</p>
            <button onClick={(e) => handleRename(pl._id, pl.name, e)} style={{ position: "absolute", top: "15px", right: "45px", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "16px", padding: "5px" }} title="Rename Playlist">✏️</button>
            <button onClick={(e) => handleDelete(pl._id, e)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#ff4b4b", cursor: "pointer", fontSize: "20px", padding: "5px" }} title="Delete Playlist">&times;</button>
          </div>
        ))}
      </div>
      {playlists.length === 0 && <p style={{ color: "#aaa", marginTop: "20px" }}>No playlists yet. Create one above!</p>}
    </div>
  );
}
export default Playlists;
