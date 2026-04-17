import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../context/PlayerContext";
import { AuthContext } from "../context/AuthContext";
import { findBestYoutubeVideo } from "../utils/youtubeHelper";

function SongCard({ song, onHistoryUpdate, onPlay, onFavoriteRemoved }) {
  const { setCurrentSong, setCurrentVideo } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favId, setFavId] = useState(null);

  // ✅ Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const exists = res.data.some((fav) => {
          if (song.genre === "pop") {
            return fav.title === song.title && fav.genre === "pop" && fav.artist === song.artist;
          }
          return fav.title === song.title && fav.genre !== "pop" && fav.composer === song.composer;
        });

        setIsFavorite(exists);
      } catch (err) {
        console.error(err);
      }
    };

    checkFavorite();
  }, [song]);

  // ❤️ ADD
  const addToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/favorites", {
        songId: song.songId || song._id,
        title: song.title,
        genre: song.genre || "carnatic",
        artist: song.artist,
        album: song.album,
        composer: song.composer,
        raga: song.raga,
        youtube: song.youtube // Pass along the cached youtube link if available
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFavorite(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ REMOVE
  const removeFromFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/favorites", {
        params: {
          title: song.title,
          genre: song.genre || "carnatic",
          artist: song.artist,
          composer: song.composer,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFavorite(false);
      if (onFavoriteRemoved) {
        onFavoriteRemoved(song._id || song.songId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="song-card"
      onClick={() => {
        setCurrentSong(song);
        navigate(`/song/${song._id || song.mbid}`);
      }}
    >
      {/* 🎵 Overlay */}
      <div className="overlay">
        <button
          className="play-btn"
          onClick={async (e) => {
            e.stopPropagation();
            setCurrentSong(song);

              try {
                const video = await findBestYoutubeVideo(song);
                setCurrentVideo(video);
                
                // 🔥 Cache it locally in the song object so favorites can pick it up
                if (video && !song.youtube) {
                   song.youtube = video;
                }

                await axios.post("http://localhost:5000/search", {
                songId: song._id || song.mbid,
                title: song.title,
                raga: song.raga,
                composer: song.composer,
                source: song.mbid ? "musicbrainz" : "local"
              });

              if (onHistoryUpdate) {
                await onHistoryUpdate();
              }

              if (onPlay) {
                onPlay();
              }
            } catch (err) {
              console.error("Play button action failed", err);
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="m8 5 10 7-10 7z" />
          </svg>
        </button>

        {/* ❤️ TOGGLE */}
        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            isFavorite ? removeFromFavorites() : addToFavorites();
          }}
        >
          {isFavorite ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4b4b">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </button>
      </div>

      <div className="song-card-content">
          <h3>{song.title}</h3>
          <p>
            {song.genre === "pop"
              ? `${song.artist || "Unknown Artist"} • ${song.album || "Pop"}`
              : `${song.raga || "Unknown Raga"} • ${song.composer || "Carnatic"}`}
          </p>
      </div>
    </div>
  );
}

export default SongCard;