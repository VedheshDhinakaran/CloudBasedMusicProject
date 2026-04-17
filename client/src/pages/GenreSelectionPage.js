import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GenreSelectionPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const name = user?.name || user?.email?.split("@")[0] || "Music Lover";

  return (
    <div className="genre-selection-page">
      <div className="genre-selection-intro">
        <h1>Choose Your Musical Journey</h1>
        <p>Hi {name}, select a genre to continue. Carnatic for classical masters, Pop for modern hits.</p>
      </div>

      <div className="genre-grid">
        <div className="genre-card" onClick={() => navigate("/carnatic")}> 
          <div className="genre-card-icon">🎼</div>
          <h2>Carnatic</h2>
          <p>Explore timeless classical melodies, ragas, and devotional compositions.</p>
        </div>

        <div className="genre-card pop" onClick={() => navigate("/pop")}> 
          <div className="genre-card-icon">🎧</div>
          <h2>Pop</h2>
          <p>Discover modern pop songs, energetic beats, and chart-topping favorites.</p>
        </div>
      </div>
    </div>
  );
}

export default GenreSelectionPage;
