// js/views/player.js
import { GeminiAPI } from '../core/api.js';
import { StorageAPI } from '../core/storage.js';
import { navigateTo } from '../router/router.js';

export function renderPlayer(container, videoData) {
    // If someone refreshes the page directly on the player without data, send them home
    if (!videoData) {
        navigateTo('home');
        return;
    }

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <button id="backBtn" style="background:none; border:none; color:var(--accent); cursor:pointer; margin-bottom:16px; font-size:16px; display:flex; align-items:center; gap:8px;">
                ← Back
            </button>
            
            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:var(--border-radius-md); margin-bottom:16px; background:#000;">
                <iframe src="https://www.youtube.com/embed/${videoData.id}?autoplay=1" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen allow="autoplay; encrypted-media"></iframe>
            </div>
            
            <h2 style="font-size:20px; margin-bottom:4px; line-height:1.4;">${videoData.title}</h2>
            <p style="color:var(--text-secondary); font-size:14px; margin-bottom:24px;">${videoData.channel}</p>
            
            <div id="actionArea">
                ${videoData.lyrics ? '' : '<button id="generateBtn" class="btn-primary">✨ Generate Lyrics & Chords</button>'}
            </div>
            
            <div id="lyricsContainer" style="margin-top:24px; white-space:pre-wrap; font-family:monospace; font-size:14px; line-height:1.6; background:var(--bg-surface); padding:20px; border-radius:var(--border-radius-md); display:${videoData.lyrics ? 'block' : 'none'};">
                ${videoData.lyrics || ''}
            </div>
        </div>
    `;

    document.getElementById('backBtn').addEventListener('click', () => navigateTo('home'));

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const actionArea = document.getElementById('actionArea');
            const lyricsContainer = document.getElementById('lyricsContainer');
            
            actionArea.innerHTML = '<p style="text-align:center; color:var(--accent);">🎵 Extracting audio and generating lyrics... (This takes a moment)</p>';
            
            try {
                const result = await GeminiAPI.generateLyrics(videoData.id, videoData.title);
                
                // Save to history
                StorageAPI.saveGeneration({
                    videoId: videoData.id,
                    videoTitle: videoData.title,
                    channel: videoData.channel,
                    lyrics: result.lyrics
                });

                actionArea.innerHTML = '';
                lyricsContainer.style.display = 'block';
                lyricsContainer.textContent = result.lyrics;
            } catch (error) {
                actionArea.innerHTML = `<p style="color:#ef4444; text-align:center;">⚠️ Failed: ${error.message}</p>`;
            }
        });
    }
}
