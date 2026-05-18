// js/core/storage.js
export const StorageAPI = {
    saveGeneration(data) {
        try {
            const history = this.getHistory();
            history.unshift({ ...data, id: Date.now(), timestamp: new Date().toISOString() });
            localStorage.setItem('lyricforge_history', JSON.stringify(history.slice(0, 50)));
        } catch (e) { 
            console.error('Save failed:', e); 
        }
    },
    
    getHistory() {
        try {
            const history = localStorage.getItem('lyricforge_history');
            return history ? JSON.parse(history) : [];
        } catch { 
            return []; 
        }
    },
    
    clearHistory() { 
        localStorage.removeItem('lyricforge_history'); 
    }
};
