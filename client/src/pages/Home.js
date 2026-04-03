import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const name = user?.name || user?.email?.split("@")[0] || "Seeker";
    const hour = new Date().getHours();
    let timeGreeting = "Namaste";
    if (hour < 12) timeGreeting = "Suprabhatam";
    else if (hour < 18) timeGreeting = "Hey";
    else timeGreeting = "Shubha Sandhya";

    return `${timeGreeting}, ${name}!`;
  };

  return (
    <div className="home">
      <div className="home-greeting-container">
        <h2 className="home-greeting">{getGreeting()}</h2>
        <p className="home-subtitle">What melodies shall we explore today?</p>
      </div>

      <h1>🎼 Explore Carnatic Music</h1>

      <div className="composer-grid">
        <div
          className="composer-card"
          onClick={() => navigate("/composer/dikshitar")}
        >
          <h2>Muthuswamy Dikshitar</h2>
        </div>

        <div
          className="composer-card"
          onClick={() => navigate("/composer/syama")}
        >
          <h2>Syama Sastri</h2>
        </div>
      </div>
    </div>
  );
}

export default Home;