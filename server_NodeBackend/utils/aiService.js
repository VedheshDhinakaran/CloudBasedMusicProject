const { pipeline } = require("@xenova/transformers");

let generator = null;

const initAI = async () => {
    if (!generator) {
        console.log("Initializing Local LLM (Xenova/phi-1_5)...");
        // We use a small but capable model for zero-cost local inference
        generator = await pipeline('text-generation', 'Xenova/phi-1_5');
    }
    return generator;
};

// Heuristic Knowledge Base for common Carnatic songs to ensure "WOW" accuracy
const KNOWLEDGE_BASE = {
    "Vatapi Ganapatim": {
        story: "Composed by Muthuswamy Dikshitar, this song is a tribute to Lord Ganesha. It is said to have been composed after Dikshitar visited the Vatapi temple. The lyrics detail the elephant-headed god's majesty and his role as the remover of obstacles.",
        beauty: "Set in Raga Hamsadhwani, it evokes a sense of auspiciousness and joy. The rhythmic structure (Adi Tala) provides a grand, marching pace that perfectly suits the divine subject."
    },
    "Bhavayami Raghuramam": {
        story: "Swathi Thirunal composed this masterpiece as a 'Ragamalika' (garland of ragas), summarizing the entire Ramayana in a single song. It covers the birth of Rama to his coronation.",
        beauty: "Its beauty lies in its seamless transition through different ragas, each matching the mood of the specific Sundara Kanda or Yuddha Kanda verses."
    }
};

const generateSongInsights = async (song) => {
    // 1. Check if we already have it in our knowledge base (High quality)
    const kbHighlight = KNOWLEDGE_BASE[song.title];
    if (kbHighlight) {
        return kbHighlight;
    }

    // 2. Otherwise, use the Local LLM to craft a story based on Metadata
    try {
        const pipe = await initAI();
        const prompt = `Describe the Carnatic song "${song.title}" in Raga ${song.raga} by ${song.composer}. Mention its spiritual story and musical beauty. Keep it concise and poetic.`;
        
        const output = await pipe(prompt, { max_new_tokens: 150 });
        const text = output[0].generated_text;

        // Simple parsing logic (split by sentence or keywords)
        const parts = text.split(".");
        return {
            story: parts.slice(0, 2).join(".") + ".",
            beauty: parts.slice(2).join(".") || `The song beautifully explores the nuances of ${song.raga}.`
        };
    } catch (err) {
        console.error("AI Generation Error:", err);
        return {
            story: `This classical composition by ${song.composer} is a significant piece in the path of Carnatic music, specifically exploring the divine aspects of its theme.`,
            beauty: `The choice of ${song.raga} brings out a unique emotional resonance, characteristic of ${song.composer}'s signature style.`
        };
    }
};

module.exports = { generateSongInsights };
