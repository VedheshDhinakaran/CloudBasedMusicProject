import axios from "axios";

// 🚀 MAIN OPTIMIZED FUNCTION
export const findBestYoutubeVideo = async (song) => {
  if (!song) return null;

  try {
    console.log("🔍 Fetching first YouTube match for:", song.title);

    const res = await axios.get("http://localhost:5000/youtube/search", {
      params: {
        songId: song._id || song.id,
        title: song.title,
        raga: song.raga || "",
        composer: song.composer || ""
      }
    });

    const video = res.data;

    // 🎯 Save learning (if match found)
    if (video && video.channelTitle) {
      localStorage.setItem("preferredSinger", video.channelTitle);
    }

    return video;
  } catch (err) {
    console.error("🚨 YouTube helper error:", err.message);
    return null;
  }
};