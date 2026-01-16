import { showNotification } from './utils.js';

let stopwatchInterval = null;
let stopwatchSeconds = 0;
let countdownInterval = null;
let countdownSeconds = 0;

export function startStopwatch() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        updateStopwatchDisplay();
    }, 1000);
}

export function pauseStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

export function resetStopwatch() {
    pauseStopwatch();
    stopwatchSeconds = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchSeconds / 3600);
    const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
    const seconds = stopwatchSeconds % 60;
    const display = document.getElementById('stopwatchDisplay');
    if (display) {
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export function startCountdown() {
    const input = document.getElementById('countdownMinutes');
    const minutes = parseInt(input?.value) || 0;
    if (minutes <= 0) {
        showNotification('Please enter valid minutes', 'error');
        return;
    }
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownSeconds = minutes * 60;
    updateCountdownDisplay();
    
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        updateCountdownDisplay();
        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            showNotification('Countdown complete!', 'success');
        }
    }, 1000);
}

export function resetCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    countdownSeconds = 0;
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    const hours = Math.floor(countdownSeconds / 3600);
    const minutes = Math.floor((countdownSeconds % 3600) / 60);
    const seconds = countdownSeconds % 60;
    const display = document.getElementById('countdownDisplay');
    if (display) {
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
