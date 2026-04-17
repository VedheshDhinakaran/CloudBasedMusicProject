const { pipeline } = require("@xenova/transformers");

let generator = null;

const initAI = async () => {
    if (!generator) {
        console.log("🤖 Initializing Local AI (Xenova/Xenova/LLaMA-2-7b)...");
        try {
            generator = await pipeline("text-generation", "Xenova/LLaMA-2-7b");
            console.log("✅ AI Model Ready");
        } catch (err) {
            console.warn("⚠️  Fallback: Using simple generation mode");
            generator = null;
        }
    }
    return generator;
};

const generateSongInsights = async (song) => {
    try {
        // Build a rich, song-specific prompt based on genre
        let prompt;
        
        if (song.genre === "pop") {
            prompt = `You are a music critic. Write two short, vivid paragraphs about the pop song "${song.title}" by ${song.artist || "Unknown"}${song.album ? ` from "${song.album}"` : ""}${song.year ? ` (${song.year})` : ""}${song.mood ? ` with a "${song.mood}" mood` : ""}.

First paragraph: "The Story" - Describe the song's emotional journey, what it's about, and why it resonates with listeners.
Second paragraph: "The Beauty" - Describe its sonic characteristics, production style, what makes it musically beautiful and memorable.

Be poetic, insightful, and specific to THIS song. Use 2-3 sentences per paragraph.`;
        } else {
            // Carnatic
            prompt = `You are a Carnatic music expert. Write two short, poetic paragraphs about the classical piece "${song.title}"${song.raga ? ` in Raga ${song.raga}` : ""}${song.tala ? ` and Tala ${song.tala}` : ""} composed by ${song.composer || "Unknown Composer"}${song.type ? ` (${song.type})` : ""}.

First paragraph: "The Story" - Describe the spiritual or devotional essence of this composition, its meaning, and the raga's significance.
Second paragraph: "The Beauty" - Describe the melodic beauty, how the raga unfolds, the emotional journey, and why this piece is timeless.

Be scholarly yet poetic. Use 2-3 sentences per paragraph.`;
        }

        const pipe = await initAI();
        
        if (!pipe) {
            // Fallback: basic generation without AI
            return generateBasicInsights(song);
        }

        console.log(`🎵 Generating insights for: ${song.title}`);
        const output = await pipe(prompt, {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
        });

        let text = output[0]?.generated_text || "";
        
        // Parse the response to extract story and beauty
        const storyMatch = text.match(/(?:The Story[:\-\s]*)([\s\S]*?)(?:The Beauty|$)/i);
        const beautyMatch = text.match(/(?:The Beauty[:\-\s]*)([\s\S]*?)$/i);

        const story = storyMatch ? storyMatch[1].trim() : text.split(".").slice(0, 2).join(".").trim();
        const beauty = beautyMatch ? beautyMatch[1].trim() : text.split(".").slice(2, 4).join(".").trim();

        return {
            story: story || generateBasicInsights(song).story,
            beauty: beauty || generateBasicInsights(song).beauty
        };
    } catch (err) {
        console.error("⚠️  AI Generation Error:", err.message);
        return generateBasicInsights(song);
    }
};

const generateBasicInsights = (song) => {
    if (song.genre === "pop") {
        return {
            story: `"${song.title}" by ${song.artist || "an artist"} captures a moment of modern emotion${song.year ? ` (${song.year})` : ""}${song.mood ? ` with a ${song.mood} vibe` : ""}. The song expresses feelings that resonate deeply with contemporary listeners through its rhythmic drive and lyrical depth.`,
            beauty: `This track shines through its polished production, ${song.album ? `from the album "${song.album}",` : ""} with infectious melodies and a memorable hook that makes it instantly recognizable and endlessly replayable.`
        };
    } else {
        // Carnatic
        return {
            story: `The composition "${song.title}"${song.raga ? ` in Raga ${song.raga}` : ""} by ${song.composer || "a master composer"} holds deep spiritual and artistic meaning. This piece carries the essence of classical Carnatic tradition with devotional fervor and scholarly precision.`,
            beauty: `The beauty of this ${song.type || "classical"} piece lies in how ${song.raga ? `the ${song.raga} raga` : "the melodic structure"} unfolds gracefully${song.tala ? `, shaped by the rhythm of ${song.tala}` : ""}. Each phrase carries emotional weight, creating a transcendent musical experience.`
        };
    }
};

module.exports = { generateSongInsights };
