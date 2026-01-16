import { appData } from './state.js';
import { saveAllData } from './storage.js';
import { showNotification } from './utils.js';
import { renderTasks } from './tasks.js';

export function initSettingsUI() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = appData.theme || 'light';
    }

    const toggleMappings = {
        autoSaveToggle: 'autoSave',
        notificationsToggle: 'notifications',
        soundEffectsToggle: 'soundEffects',
        compactModeToggle: 'compactMode',
        showCompletedToggle: 'showCompleted'
    };
    
    for (const [id, key] of Object.entries(toggleMappings)) {
        const toggle = document.getElementById(id);
        if (toggle) {
            if (appData.settings[key]) toggle.classList.add('active');
            else toggle.classList.remove('active');
        }
    }
}

export function changeTheme(theme) {
    let appliedTheme = theme;
    if (theme === 'auto') {
        appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', appliedTheme);
    appData.theme = theme;
    saveAllData();
    
    const themeToggle = document.getElementById('themeToggle');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = appliedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    showNotification(`Theme changed to ${theme}`, 'success');
}

export function toggleSetting(setting) {
    if (appData.settings.hasOwnProperty(setting)) {
        appData.settings[setting] = !appData.settings[setting];
        
        const toggle = document.getElementById(`${setting}Toggle`);
        if (toggle) {
            toggle.classList.toggle('active', appData.settings[setting]);
        }
        
        if (setting === 'compactMode') {
            document.body.classList.toggle('compact-mode', appData.settings.compactMode);
        } else if (setting === 'showCompleted') {
            renderTasks();
        }
        
        saveAllData();
        showNotification(`${setting} ${appData.settings[setting] ? 'enabled' : 'disabled'}`, 'success');
    }
}

export function updateSettingsUI() {
    initSettingsUI();
}
