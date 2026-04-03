import React, { useEffect, useState } from "react";
import axios from "axios";

function SearchBar({ onSearch }) {
  const [title, setTitle] = useState("");
  const [raga, setRaga] = useState("");
  const [composer, setComposer] = useState(""); // ✅ NEW

  const [ragas, setRagas] = useState([]);
  const [composers, setComposers] = useState([]); // ✅ NEW

  // ✅ Fetch ragas
  useEffect(() => {
    const fetchRagas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/songs/meta/ragas");
        setRagas(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRagas();
  }, []);

  // ✅ Fetch composers
  useEffect(() => {
    const fetchComposers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/songs/meta/composers");
        setComposers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComposers();
  }, []);

  // ✅ Auto search
  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams();

      if (title.trim()) params.append("title", title.trim());
      if (raga) params.append("raga", raga);
      if (composer) params.append("composer", composer); // ✅ NEW

      const query = params.toString() ? `?${params.toString()}` : "";
      onSearch(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [title, raga, composer]); // ✅ include composer
  return (
    <div className="spotify-search" style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
      {/* 🔍 Search Input */}
      <div 
        className="search-input" 
        style={{ 
          display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", 
          borderRadius: "30px", padding: "12px 20px", flex: 1, border: "1px solid rgba(255,255,255,0.15)",
          transition: "0.3s"
        }}
        onFocus={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        onBlur={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      >
        <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#aaa", marginRight: "10px" }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          placeholder="Search for songs..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ 
            background: "transparent", border: "none", color: "white", 
            outline: "none", width: "100%", fontSize: "16px" 
          }}
        />
      </div>

      {/* 🎼 Raga Dropdown */}
      <select
        className="dropdown"
        value={raga}
        onChange={(e) => setRaga(e.target.value)}
        style={{ 
          background: "rgba(255,255,255,0.08)", color: "white", padding: "12px 20px",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: "30px",
          outline: "none", fontSize: "15px", cursor: "pointer"
        }}
      >
        <option value="" style={{ color: "black" }}>All Ragas</option>
        {ragas.map((r, index) => (
          <option key={index} value={r} style={{ color: "black" }}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;