// js/app.js
import { initRouter } from './router/router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 LyricForge Pro initialized');
    
    // Start the router and load the default page
    initRouter();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('✅ Service Worker registered'))
            .catch(err => console.error('❌ Service Worker failed', err));
    }
});
