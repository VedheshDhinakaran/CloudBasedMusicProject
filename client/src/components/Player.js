import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { findBestYoutubeVideo } from "../utils/youtubeHelper";

function Player() {
  const { currentSong, currentVideo, playNext, isPlaying, setIsPlaying, setCurrentVideo } = useContext(PlayerContext);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (audioRef.current && currentSong && currentSong.audio) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load(); // Reload the audio element with new src
      if (isPlaying) {
        audioRef.current.play()
          .catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current && currentSong && !currentSong.audio) {
      // If no audio, pause
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentSong]);

  // Fetch YouTube video when currentSong changes
  useEffect(() => {
    const fetchVideo = async () => {
      if (currentSong) {
        try {
          const video = await findBestYoutubeVideo(currentSong);
          setCurrentVideo(video);
        } catch (err) {
          console.error("Failed to fetch YouTube video", err);
        }
      }
    };
    fetchVideo();
  }, [currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!currentSong) return null;

  return (
    <div className="player">
        {/* 🎬 YouTube Video Modal/Iframe */}
        {currentVideo && currentVideo.videoId && (
            <div className={`player-video-container ${showVideo ? "show" : ""}`}>
                <button className="video-close-btn" onClick={() => setShowVideo(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${showVideo ? 1 : 0}&mute=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        )}

        {/* Left: Track Info */}
        <div className="player-track-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.composer} • {currentSong.raga}</p>
        </div>

        {/* Center: Controls & Progress */}
        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-button" title="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="m6 6 12 6-12 6zM18 6h2v12h-2z" />
              </svg>
            </button>
            <button className="control-button play-pause-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m8 5 10 7-10 7z" />
                </svg>
              )}
            </button>
            <button className="control-button" title="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="m6 18 12-6L6 6zM16 6h2v12h-2z" />
              </svg>
            </button>
          </div>

          <div className="player-progress">
             <span className="progress-time">{formatTime(audioRef.current?.currentTime)}</span>
             <div className="progress-bar-container" onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const pct = x / rect.width;
                 if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
             }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
             </div>
             <span className="progress-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Youtube Toggle/Volume */}
        <div style={{ width: "30%", display: "flex", justifyContent: "flex-end", gap: "16px", alignItems: "center" }}>
            {currentVideo && currentVideo.videoId && (
                <button 
                  className={`control-button ${showVideo ? "active" : ""}`} 
                  title="Toggle Video" 
                  onClick={() => setShowVideo(!showVideo)}
                  style={{ 
                    color: showVideo ? "var(--accent-bright)" : "#b3b3b3",
                    background: showVideo ? "rgba(14, 165, 233, 0.1)" : "none",
                    borderRadius: "8px",
                    padding: "6px"
                  }}
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                   </svg>
                </button>
            )}
            <div className="control-button">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M11 5 6 9H2v6h4l5 4zm4.5 7c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
               </svg>
            </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={playNext}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
    </div>
  );
}

export default Player;
