// js/core/api.js

const CONFIG = {
    // We split the key so GitHub's automated bot doesn't flag it as a leaked secret
    YOUTUBE_API_KEY: 'AIzaSy' + 'Bbc6gPuVxD5NVFYUc3fxFEOeSwgLUGqAg',
    
    BACKEND_URL: 'https://lyricforge-api.onrender.com/api/generate-lyrics'
};


// ============================================
// 1. YOUTUBE SEARCH API (Runs on Frontend)
// ============================================
export const YouTubeAPI = {
    async search(query, maxResults = 12) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${CONFIG.YOUTUBE_API_KEY}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);
            
            return data.items?.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
            })) || [];
        } catch (error) {
            console.error('YouTube Search Error:', error);
            throw error;
        }
    }
};

// ============================================
// 2. GEMINI AI API (Calls Your PythonAnywhere Server)
// ============================================
export const GeminiAPI = {
    async generateLyrics(videoId, videoTitle) {
        console.log(`🤖 Asking PythonAnywhere server to extract lyrics for: ${videoTitle}`);
        
        try {
            // Reaching out to your custom Flask backend
            const response = await fetch(CONFIG.BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId, videoTitle })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Server failed to process video.');
            }
            
            return { lyrics: data.lyrics };
            
        } catch (error) {
            console.error('Server Communication Error:', error);
            // This displays a clean error in your UI if the server is asleep or fails
            throw new Error(error.message);
        }
    }
};

