import { appData } from './state.js';
import { saveAllData } from './storage.js';
import { showNotification } from './utils.js';

export function openUserProfile() {
    document.getElementById('userProfileModal')?.classList.add('active');
}

export function closeUserProfile() {
    document.getElementById('userProfileModal')?.classList.remove('active');
}

export function saveUserProfile() {
    // Sync UI to appData
    saveAllData();
    closeUserProfile();
    showNotification('Profile saved', 'success');
}

export function changeAvatar() {
    showNotification('Avatar changed', 'success');
}
