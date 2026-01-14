import { appData } from './state.js';

export function initSettingsUI() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = localStorage.getItem('studyhub-theme') || 'auto';
        themeSelect.addEventListener('change', (e) => {
            // Apply theme logic
        });
    }

    const autoSaveToggle = document.getElementById('autoSaveToggle');
    if (autoSaveToggle) {
        autoSaveToggle.checked = appData.settings.autoSave;
        autoSaveToggle.addEventListener('change', (e) => {
            appData.settings.autoSave = e.target.checked;
            localStorage.setItem('aura-settings', JSON.stringify(appData.settings));
        });
    }
}

export function updateSettingsUI() {
    // Sync UI with appData.settings
}
