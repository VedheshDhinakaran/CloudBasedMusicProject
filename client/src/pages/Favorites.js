import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Fetch Favorites Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>❤️ Favorites</h2>

      {loading ? (
        <p>Loading your favorites...</p>
      ) : favorites.length === 0 ? (
        <p>No favorites yet. Add some from the songs page!</p>
      ) : (
        <div className="grid">
          {favorites.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              onFavoriteRemoved={(removedId) =>
                setFavorites((prev) => prev.filter((s) => s._id !== removedId))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;