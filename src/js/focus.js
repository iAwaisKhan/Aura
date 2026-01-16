import { appData } from './state.js';
import { showNotification } from './utils.js';
import { saveAllData } from './storage.js';

let focusInterval = null;
let focusSecondsRemaining = 0;
let focusPaused = false;
let focusSessionMinutes = 0;

export function startFocusSession(minutes) {
    if (focusInterval) {
        showNotification('A focus session is already running!', 'error');
        return;
    }
    focusSessionMinutes = minutes;
    focusSecondsRemaining = minutes * 60;
    focusPaused = false;
    
    document.getElementById('focusSessionModal')?.classList.add('active');
    
    focusInterval = setInterval(() => {
        if (!focusPaused) {
            focusSecondsRemaining--;
            updateFocusDisplay();
            if (focusSecondsRemaining <= 0) {
                completeFocusSession();
            }
        }
    }, 1000);
}

function updateFocusDisplay() {
    const display = document.getElementById('focusTimerDisplay');
    if (!display) return;
    const minutes = Math.floor(focusSecondsRemaining / 60);
    const seconds = focusSecondsRemaining % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function pauseFocusSession() {
    focusPaused = !focusPaused;
}

export function stopFocusSession() {
    clearInterval(focusInterval);
    focusInterval = null;
    document.getElementById('focusSessionModal')?.classList.remove('active');
}

function completeFocusSession() {
    stopFocusSession();
    showNotification('Focus session complete!', 'success');
}

export function startCustomFocusSession() {
    const input = document.getElementById('customFocusMinutes');
    const minutes = parseInt(input?.value);
    if (minutes > 0) {
        startFocusSession(minutes);
    }
}

export function viewFocusHistory() {
    showNotification('Focus history coming soon!', 'info');
}
