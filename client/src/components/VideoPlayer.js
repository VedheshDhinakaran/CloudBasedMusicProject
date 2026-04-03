import React from "react";

const VideoPlayer = ({ video, onClose }) => {
  if (!video || !video.videoId) return null;

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeStyle}>✕</button>
        <h3>{video.title}</h3>
        <p style={{ margin: "4px 0", color: "#555" }}>{video.channelTitle}</p>

        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            title="youtube-carnatic-video"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalStyle = {
  width: "90%",
  maxWidth: "760px",
  background: "white",
  borderRadius: "10px",
  padding: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  position: "relative"
};

const closeStyle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  border: "none",
  background: "transparent",
  fontSize: "22px",
  cursor: "pointer"
};

export default VideoPlayer;
