import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQueueLoaded, setIsQueueLoaded] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get("http://localhost:5000/queue");
        if (res.data) {
          setQueue(res.data.songs || []);
          setCurrentQueueIndex(res.data.currentQueueIndex !== undefined ? res.data.currentQueueIndex : -1);
          if (res.data.songs && res.data.songs.length > 0 && res.data.currentQueueIndex !== undefined && res.data.currentQueueIndex >= 0) {
            setCurrentSong(res.data.songs[res.data.currentQueueIndex]);
          }
        }
        setIsQueueLoaded(true);
      } catch (err) {
        console.error("Failed to fetch queue", err);
        setIsQueueLoaded(true);
      }
    };
    fetchQueue();
  }, []);

  useEffect(() => {
    if (isQueueLoaded) {
      axios.post("http://localhost:5000/queue", {
        queue,
        currentQueueIndex
      }).catch(err => console.error("Failed to save queue", err));
    }
  }, [queue, currentQueueIndex, isQueueLoaded]);

  const playPlaylist = (playlistSongs) => {
    if (!playlistSongs || playlistSongs.length === 0) return;
    setQueue(playlistSongs);
    setCurrentQueueIndex(0);
    setCurrentSong(playlistSongs[0]);
    setIsPlaying(true);
  };

  const addToQueue = (song) => {
    setQueue((prev) => {
      // 🛡️ NO-DUPLICATE CONSTRAINT: Only add if not already in queue
      const exists = prev.some((s) => s._id === song._id);
      if (exists) return prev;

      // If it's the first song, play it automatically
      if (prev.length === 0) {
        setCurrentSong(song);
        setCurrentQueueIndex(0);
        setIsPlaying(true);
      }
      return [...prev, song];
    });
  };

  const removeFromQueue = (index) => {
    // 💡 SAFER: Handle other state updates first before changing the queue
    if (index === currentQueueIndex) {
      setIsPlaying(false);
      setCurrentSong(null);
      setCurrentQueueIndex(-1);
    } else if (index < currentQueueIndex) {
      setCurrentQueueIndex((prev) => prev - 1);
    }

    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const playNext = () => {
    if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      const nextSong = queue[nextIndex];
      setCurrentSong(nextSong);
      setCurrentQueueIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const playFromQueue = (index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentSong(queue[index]);
      setCurrentQueueIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        currentVideo,
        setCurrentVideo,
        queue,
        setQueue,
        addToQueue,
        removeFromQueue,
        playNext,
        currentQueueIndex,
        setCurrentQueueIndex,
        playFromQueue,
        isPlaying,
        setIsPlaying,
        togglePlay
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}