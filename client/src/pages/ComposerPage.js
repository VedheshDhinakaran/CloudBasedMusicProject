import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import SearchBar from "../components/SearchBar";

function ComposerPage() {
  const { name } = useParams();
  const [songs, setSongs] = useState([]);

  const fetchSongs = async (query = "") => {
    try {
      let composerName =
        name === "dikshitar"
          ? "Muthuswamy Dikshitar"
          : "Syama Sastri";

      const url = `http://localhost:5000/songs?composer=${composerName}${
        query ? "&" + query.substring(1) : ""
      }`;

      console.log("FETCH:", url);

      const res = await axios.get(url);
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [name]);

  return (
    <div>
      <h2>{name.toUpperCase()} Songs</h2>

      {/* 🔍 SEARCH BAR */}
      <SearchBar onSearch={fetchSongs} />

      <div className="grid">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default ComposerPage;