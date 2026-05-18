// js/views/home.js
import { YouTubeAPI } from '../core/api.js';
import { navigateTo } from '../router/router.js';

export async function renderHome(container) {
    container.innerHTML = `
        <div class="search-bar">
            <span style="font-size: 20px; padding-right: 8px;">🔍</span>
            <input type="text" id="searchInput" placeholder="Search songs, artists, or vibes...">
            <button id="micBtn" style="background:none; border:none; color:var(--accent); font-size:20px; cursor:pointer;" title="Voice Search">🎤</button>
        </div>
        
        <h2 style="margin-bottom: 16px; font-size: 20px;">🔥 Trending Music</h2>
        <div id="videoGrid" class="video-grid">
            <div style="text-align:center; padding:40px; grid-column: 1 / -1;">
                <p style="color: var(--text-secondary);">Loading trending videos...</p>
            </div>
        </div>
    `;

    // 1. Setup Event Listeners
    const searchInput = document.getElementById('searchInput');
    const micBtn = document.getElementById('micBtn');

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            loadVideos(searchInput.value);
        }
    });

    micBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search isn't supported in this browser 😢");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        searchInput.placeholder = "Listening... Speak now 🎤";
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchInput.placeholder = "Search songs, artists, or vibes...";
            loadVideos(transcript);
        };
        recognition.start();
    });

    // 2. Load Initial Data
    await loadVideos('trending official music video pop');
}

async function loadVideos(query) {
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Searching...</p>';
    
    try {
        const videos = await YouTubeAPI.search(query);
        if (videos.length === 0) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No videos found.</p>';
            return;
        }

        grid.innerHTML = '';
        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                </div>
            `;
            // Navigate to the player and pass the video object!
            card.addEventListener('click', () => navigateTo('player', video));
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = `<p style="color:#ef4444; grid-column: 1 / -1;">Error: ${error.message}</p>`;
    }
}
