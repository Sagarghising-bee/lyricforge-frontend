// js/views/history.js
import { StorageAPI } from '../core/storage.js';
import { navigateTo } from '../router/router.js';

export function renderHistory(container) {
    const history = StorageAPI.getHistory();

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
            <h1 style="font-size:24px;">📜 Saved Lyrics</h1>
            <button id="clearBtn" style="background:none; border:1px solid #ef4444; color:#ef4444; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:12px;">Clear All</button>
        </div>
        <div id="historyList" style="display:flex; flex-direction:column; gap:16px;"></div>
    `;

    const list = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearBtn');

    if (history.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-secondary); margin-top:40px;">No saved lyrics yet.</p>';
    } else {
        history.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = 'background:var(--bg-surface); padding:16px; border-radius:var(--border-radius-md); border:1px solid var(--border-color);';
            card.innerHTML = `
                <h3 style="font-size:16px; margin-bottom:8px; line-height:1.4;">${item.videoTitle}</h3>
                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Saved: ${new Date(item.timestamp).toLocaleDateString()}</p>
                <button class="view-btn btn-primary" style="padding:8px 16px; font-size:14px; width:auto;">View Lyrics & Play</button>
            `;
            
            // Re-open the player with the saved lyrics so it doesn't re-generate
            card.querySelector('.view-btn').addEventListener('click', () => navigateTo('player', item));
            list.appendChild(card);
        });
    }

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all saved lyrics?')) {
            StorageAPI.clearHistory();
            renderHistory(container); // Re-render the empty state
        }
    });
}
