import { appData, DATA_EXPORT_VERSION, STORAGE_COLLECTIONS } from './state.js';
import { ensureObject, showNotification } from './utils.js';

export function safeParseArrayFromStorage(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
        return null;
    }
}

export function safeParseObjectFromStorage(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
        return null;
    }
}

export function saveAllData() {
    try {
        localStorage.setItem('aura-notes', JSON.stringify(appData.notes));
        localStorage.setItem('aura-tasks', JSON.stringify(appData.tasks));
        localStorage.setItem('aura-snippets', JSON.stringify(appData.snippets));
        localStorage.setItem('aura-schedule', JSON.stringify(appData.schedule));
        localStorage.setItem('aura-settings', JSON.stringify(appData.settings));
        localStorage.setItem('aura-productivity', JSON.stringify(appData.productivity));
        localStorage.setItem('aura-last-save', new Date().toISOString());
        showNotification('Data saved', 'success', 2000);
    } catch (e) {
        showNotification('Failed to save', 'error', 3000);
        console.error('Save error:', e);
    }
}

export function validateImportPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return { valid: false, message: 'Invalid backup format.' };
    }
    if (payload.version && payload.version !== DATA_EXPORT_VERSION) {
        return { valid: false, message: `Unsupported backup version ${payload.version}.` };
    }
    if (!payload.data || typeof payload.data !== 'object') {
        return { valid: false, message: 'Backup missing data section.' };
    }

    const normalized = {
        userProfile: { ...appData.userProfile },
        focusMode: { ...appData.focusMode },
        productivity: { ...appData.productivity },
        settings: { ...appData.settings }
    };

    STORAGE_COLLECTIONS.forEach(collection => {
        const collectionValue = payload.data[collection];
        normalized[collection] = Array.isArray(collectionValue) ? collectionValue : [];
    });

    normalized.userProfile = {
        ...normalized.userProfile,
        ...ensureObject(payload.data.userProfile)
    };
    normalized.focusMode = {
        ...normalized.focusMode,
        ...ensureObject(payload.data.focusMode)
    };
    normalized.productivity = {
        ...normalized.productivity,
        ...ensureObject(payload.data.productivity)
    };
    normalized.settings = {
        ...normalized.settings,
        ...ensureObject(payload.data.settings)
    };

    return {
        valid: true,
        data: normalized
    };
}
