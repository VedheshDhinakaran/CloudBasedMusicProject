import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function ProfilePage() {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteSingers, setFavoriteSingers] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setFavoriteSingers(user.favoriteSingers?.join(", ") || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const singersArray = favoriteSingers.split(",").map(s => s.trim()).filter(s => s);
      await updateProfile({ name, bio, favoriteSingers: singersArray });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page" style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', marginBottom: "32px" }}>My Profile</h1>
      
      <div className="auth-card" style={{
        background: "rgba(30, 41, 59, 0.7)",
        backdropFilter: "blur(20px)",
        padding: "40px",
        borderRadius: "24px",
        maxWidth: "600px",
        border: "1px solid rgba(56, 189, 248, 0.2)"
      }}>
        {message && <p style={{ color: "#4ade80", marginBottom: "16px" }}>{message}</p>}
        {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              className="search-input" 
              style={{ width: "100%", padding: "12px 16px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>About You (Bio)</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="search-input" 
              style={{ width: "100%", padding: "12px 16px", minHeight: "120px", borderRadius: "16px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>Favorite Singers (comma separated)</label>
            <input 
              type="text" 
              value={favoriteSingers} 
              onChange={(e) => setFavoriteSingers(e.target.value)}
              className="search-input" 
              style={{ width: "100%", padding: "12px 16px" }}
              placeholder="e.g. M.S. Subbulakshmi, Sudha Ragunathan"
            />
          </div>
          <button type="submit" className="play-pause-btn" style={{ 
            width: "100%", height: "55px", borderRadius: "12px", 
            fontSize: "1.2rem", fontWeight: "600", marginTop: "12px"
          }}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
