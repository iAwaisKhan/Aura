import { switchView, toggleTheme } from './ui.js';
import { handleSearch } from './search.js';
import { toggleTaskComplete } from './tasks.js';
import { exportAllData, saveAllData } from './storage.js';
import { showShortcutsModal } from './ui.js';

export function setupEventListeners(lenis) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view, lenis);
        });
    });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) globalSearch.addEventListener('input', handleSearch);
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch(e.key.toLowerCase()) {
                case 's': e.preventDefault(); saveAllData(); break;
                case 'b': e.preventDefault(); exportAllData(); break;
                case '/': e.preventDefault(); showShortcutsModal(); break;
            }
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(e.target.dataset.taskId);
            toggleTaskComplete(taskId);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                if (lenis) lenis.start();
            }, 300);
        }
    });
}
