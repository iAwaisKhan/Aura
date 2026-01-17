// Unified entry point for Aura
import { initLenisScroll } from './js/scroll.js';
import { initTheme, toggleTheme, switchView, showShortcutsModal } from './js/ui.js';
import { initSettingsUI, changeTheme, toggleSetting } from './js/settings.js';
import { loadSampleData, renderAll } from './js/init.js';
import { migrateFromLocalStorage, loadAllData, exportAllData, importData, clearAllData } from './js/storage.js';
import { setupEventListeners } from './js/events.js';
import { updateDashboard, refreshRecentActivity } from './js/dashboard.js';
import { updateCurrentDate, startLiveClock } from './js/clock.js';
import { displayRandomQuote } from './js/quotes.js';
import { initNetworkAnimation } from './js/visuals.js';
import { applyStaggerAnimation } from './js/utils.js';
import { setPomodoroMode, startPomodoro, pausePomodoro, resetPomodoro } from './js/pomodoro.js';
import { filterResources, showResourceEditor, resetResourceFilters } from './js/resources.js';
import { toggleTaskComplete, filterTasks, sortTasks, selectAllTasks, markSelectedTasksComplete, deleteSelectedTasks, showTaskEditor } from './js/tasks.js';
import { showNoteEditor } from './js/notes.js';
import { showSnippetEditor, copySnippet } from './js/snippets.js';
import { showScheduleEditor, toggleScheduleComplete, filterSchedule } from './js/schedule.js';
import { startFocusSession, startCustomFocusSession, pauseFocusSession, stopFocusSession, viewFocusHistory } from './js/focus.js';
import { openUserProfile, closeUserProfile, saveUserProfile, changeAvatar } from './js/profile.js';
import { showProductivityReport } from './js/productivity.js';
import { startStopwatch, pauseStopwatch, resetStopwatch, startCountdown, resetCountdown } from './js/timer.js';
import { initTechNews, filterNewsByCategory, initTechEvents, filterEventsByType, filterEventsByTime } from './js/news.js';
import { appData } from './js/state.js';

let lenis;

async function initApp() {
    try {
        lenis = initLenisScroll();
        initTheme();
        initSettingsUI();
        
        // Handle Storage Update (LocalStorage -> IndexedDB)
        await migrateFromLocalStorage();
        
        // Load data from IndexedDB
        const loaded = await loadAllData();
        
        // Use sample data if nothing was loaded
        if (!loaded || (appData.notes.length === 0 && appData.tasks.length === 0)) {
            loadSampleData();
        }
        
        setupEventListeners(lenis);
        updateDashboard();
        updateCurrentDate();
        startLiveClock();
        displayRandomQuote();
        renderAll();
        initNetworkAnimation();
        
        // Initialize news and events
        initTechNews();
        initTechEvents();
        
    } catch (error) {
        console.error('Core app initialization failed:', error);
    }
    
    // Apply stagger animation to initial view
    const activeView = document.querySelector('.view.active');
    if (activeView) {
        applyStaggerAnimation(activeView);
    }
}

// Make functions global for HTML onclick compatibility
window.switchView = (view) => switchView(view, lenis);
window.toggleTheme = toggleTheme;
window.changeTheme = changeTheme;
window.toggleSetting = toggleSetting;
window.showProductivityReport = showProductivityReport;
window.exportAllData = exportAllData;
window.importData = importData;
window.clearAllData = clearAllData;
window.openUserProfile = openUserProfile;
window.closeUserProfile = closeUserProfile;
window.saveUserProfile = saveUserProfile;
window.changeAvatar = changeAvatar;
window.showShortcutsModal = showShortcutsModal;
window.toggleTaskComplete = toggleTaskComplete;
window.refreshRecentActivity = refreshRecentActivity;
window.displayRandomQuote = displayRandomQuote;
window.showNoteEditor = showNoteEditor;
window.showTaskEditor = showTaskEditor;
window.selectAllTasks = selectAllTasks;
window.markSelectedTasksComplete = markSelectedTasksComplete;
window.deleteSelectedTasks = deleteSelectedTasks;
window.showSnippetEditor = showSnippetEditor;
window.showScheduleEditor = showScheduleEditor;
window.viewFocusHistory = viewFocusHistory;
window.filterTasks = filterTasks;
window.sortTasks = sortTasks;
window.filterSchedule = filterSchedule;
window.startFocusSession = startFocusSession;
window.startCustomFocusSession = startCustomFocusSession;
window.pauseFocusSession = pauseFocusSession;
window.stopFocusSession = stopFocusSession;
window.copySnippet = copySnippet;
window.toggleScheduleComplete = toggleScheduleComplete;
window.setPomodoroMode = setPomodoroMode;
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
window.startStopwatch = startStopwatch;
window.pauseStopwatch = pauseStopwatch;
window.resetStopwatch = resetStopwatch;
window.startCountdown = startCountdown;
window.resetCountdown = resetCountdown;
window.filterResources = filterResources;
window.showResourceEditor = showResourceEditor;
window.resetResourceFilters = resetResourceFilters;
window.initTechNews = initTechNews;
window.filterNewsByCategory = filterNewsByCategory;
window.initTechEvents = initTechEvents;
window.filterEventsByType = filterEventsByType;
window.filterEventsByTime = filterEventsByTime;

// Start the application
document.addEventListener('DOMContentLoaded', initApp);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}
