// js/router/router.js
import { renderHome } from '../views/home.js';
import { renderHistory } from '../views/history.js';
import { renderPlayer } from '../views/player.js';

const appRoot = document.getElementById('app-root');

export function initRouter() {
    // Listen for clicks on the bottom navigation
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const route = e.currentTarget.dataset.route;
            navigateTo(route);
        });
    });

    // Load initial route
    navigateTo('home');
}

export function navigateTo(route, data = null) {
    // Update active state on navigation bar
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.route === route);
    });

    // Clear current view
    appRoot.innerHTML = '';

    // Inject the requested view
    switch (route) {
        case 'home':
            renderHome(appRoot);
            break;
        case 'history':
            renderHistory(appRoot);
            break;
        case 'player':
            renderPlayer(appRoot, data); // Passes video data to the player
            break;
        default:
            renderHome(appRoot);
    }
}
