import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProfileSetup() {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteSingers, setFavoriteSingers] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const singersArray = favoriteSingers.split(",").map(s => s.trim()).filter(s => s);
      await updateProfile({ name, bio, favoriteSingers: singersArray });
      navigate("/");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="profile-setup-page" style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" 
    }}>
      <div className="auth-card" style={{
        background: "rgba(30, 41, 59, 0.7)",
        backdropFilter: "blur(20px)",
        padding: "40px",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "500px",
        border: "1px solid rgba(56, 189, 248, 0.3)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "32px", fontFamily: '"Playfair Display", serif' }}>
          Complete Your Profile
        </h2>

        {error && <p style={{ color: "#ff4b4b", textAlign: "center" }}>{error}</p>}

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
              placeholder="e.g. Aditi Sharma"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>About You</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="search-input" 
              style={{ width: "100%", padding: "12px 16px", minHeight: "100px", borderRadius: "16px" }}
              placeholder="Tell us about your interest in Carnatic music..."
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
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
