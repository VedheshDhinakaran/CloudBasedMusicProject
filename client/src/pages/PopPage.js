import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SongCard from "../components/SongCard";

function PopPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const [artists, setArtists] = useState([]);

  const getGreeting = () => {
    const name = user?.name || user?.email?.split("@")[0] || "Seeker";
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  useEffect(() => {
    const fetchPopSongs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pop-songs");
        setSongs(res.data);
        setFilteredSongs(res.data);
        setArtists([...new Set(res.data.map((song) => song.artist).filter(Boolean))]);
      } catch (err) {
        console.error("Error fetching pop songs:", err);
      }
    };

    fetchPopSongs();
  }, []);

  useEffect(() => {
    let updated = songs;

    if (artistFilter !== "all") {
      updated = updated.filter((song) => song.artist === artistFilter);
    }

    if (query.trim() !== "") {
      const lower = query.toLowerCase();
      updated = updated.filter((song) =>
        song.title.toLowerCase().includes(lower) ||
        (song.artist || "").toLowerCase().includes(lower) ||
        (song.album || "").toLowerCase().includes(lower) ||
        (song.mood || "").toLowerCase().includes(lower)
      );
    }

    setFilteredSongs(updated);
  }, [query, artistFilter, songs]);

  return (
    <div className="pop-page">
      <div className="genre-selection-intro">
        <h1>{getGreeting()}</h1>
        <p>Browse pop songs stored in the database. Search by title, artist, album or mood.</p>
      </div>

      <div className="pop-controls">
        <input
          className="search-input"
          placeholder="Search pop songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="artist-filter"
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
        >
          <option value="all">All artists</option>
          {artists.map((artist) => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>
      </div>

      <div className="composer-grid">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <SongCard key={song._id} song={song} />
          ))
        ) : (
          <p>No pop songs found. Try a different search or select another artist.</p>
        )}
      </div>
    </div>
  );
}

export default PopPage;
