// StudyHub - Complete JavaScript Application

// Application State
const appData = {
    notes: [],
    tasks: [],
    snippets: [],
    schedule: [],
    resources: [],
    currentView: 'dashboard',
    theme: 'light',
    userProfile: {
        name: '',
        email: '',
        bio: '',
        goal: '',
        skills: [],
        avatarIcon: 'fa-user'
    }
};

// Quotes
const quotes = [
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" }
];

// Initialize Theme
function initTheme() {
    // Load saved theme from localStorage or detect system preference
    const savedTheme = localStorage.getItem('studyhub-theme');
    let theme = savedTheme || 'auto';
    
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    appData.theme = theme;
    
    // Update UI elements
    const themeToggle = document.getElementById('themeToggle');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme || 'auto';
    }
}

// Initialize App
function initApp() {
    initTheme();
    loadSampleData();
    setupEventListeners();
    updateDashboard();
    updateCurrentDate();
    startLiveClock();
    displayRandomQuote();
    renderAll();
    initNetworkAnimation();
    
    // Add initial loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}

// Load Sample Data
function loadSampleData() {
    appData.notes = [
        { id: 1, title: "JavaScript Basics", content: "Learn array methods: map, filter, reduce", tags: ["javascript", "programming"], category: "Study", created: new Date() },
        { id: 2, title: "Web Dev Projects", content: "Build portfolio, task manager, weather app", tags: ["projects", "web-dev"], category: "Project", created: new Date() }
    ];

    appData.tasks = [
        { id: 1, title: "Complete JavaScript assignment", description: "Build a todo list app", priority: "High", dueDate: "2025-11-20", status: "To Do" },
        { id: 2, title: "Read Chapter 5", description: "Data Structures chapter", priority: "Medium", dueDate: "2025-11-22", status: "In Progress" }
    ];

    appData.snippets = [
        { id: 1, title: "Fetch API", language: "JavaScript", code: "fetch('api/data').then(r => r.json())", tags: ["api", "fetch"] },
        { id: 2, title: "CSS Flexbox", language: "CSS", code: ".container { display: flex; justify-content: center; }", tags: ["css", "layout"] }
    ];

    appData.resources = [
        { id: 1, title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Documentation", tags: ["html", "css", "js"] },
        { id: 2, title: "JavaScript30", url: "https://javascript30.com", category: "Course", tags: ["javascript", "practice"] }
    ];

    appData.schedule = [
        { id: 1, day: "monday", time: "09:00 AM", subject: "Data Structures", description: "Arrays and Linked Lists", location: "Room 301", completed: false },
        { id: 2, day: "monday", time: "02:00 PM", subject: "Web Development", description: "React Hooks Practice", location: "Lab 2", completed: false },
        { id: 3, day: "tuesday", time: "10:00 AM", subject: "Algorithms", description: "Sorting Algorithms", location: "Room 205", completed: false },
        { id: 4, day: "wednesday", time: "11:00 AM", subject: "Database Systems", description: "SQL Queries", location: "Room 401", completed: false },
        { id: 5, day: "thursday", time: "01:00 PM", subject: "Computer Networks", description: "TCP/IP Protocol", location: "Room 302", completed: false },
        { id: 6, day: "friday", time: "03:00 PM", subject: "Software Engineering", description: "Agile Methodology", location: "Room 105", completed: false }
    ];
}

// Setup Event Listeners
function setupEventListeners() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('globalSearch').addEventListener('input', handleSearch);
    
    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('studyhub-theme');
        if (savedTheme === 'auto') {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            appData.theme = newTheme;
            
            const icon = document.querySelector('#themeToggle i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    });
}

// Switch View
function switchView(viewName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.add('active');
        appData.currentView = viewName;
    }
}

// Toggle Theme
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply theme
    html.setAttribute('data-theme', newTheme);
    appData.theme = newTheme;
    
    // Save to localStorage
    localStorage.setItem('studyhub-theme', newTheme);
    
    // Update icon and aria-label
    const themeToggle = document.getElementById('themeToggle');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    }
    
    // Update settings dropdown
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = newTheme;
    }
    
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'success');
}

function changeTheme(theme) {
    const savedThemePreference = theme; // Save original preference
    let appliedTheme = theme;
    
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        appliedTheme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', appliedTheme);
    appData.theme = appliedTheme;
    
    // Save preference to localStorage
    localStorage.setItem('studyhub-theme', savedThemePreference);
    
    // Update toggle button icon and aria-label
    const themeToggle = document.getElementById('themeToggle');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = appliedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${appliedTheme === 'dark' ? 'light' : 'dark'} mode`);
    }
    
    showToast(`Theme changed to ${theme === 'auto' ? 'Auto' : appliedTheme === 'dark' ? 'Dark' : 'Light'} mode`, 'success');
}

// Update Dashboard
function updateDashboard() {
    // Update greeting based on time of day
    updateGreeting();
    
    // Get current stats
    const stats = {
        totalNotes: appData.notes.length,
        activeTasks: appData.tasks.filter(t => t.status !== 'Done').length,
        codeSnippets: appData.snippets.length,
        savedResources: appData.resources.length
    };
    
    // Animate stat values with count-up effect
    animateStatValue('totalNotes', stats.totalNotes);
    animateStatValue('activeTasks', stats.activeTasks);
    animateStatValue('codeSnippets', stats.codeSnippets);
    animateStatValue('savedResources', stats.savedResources);
    
    // Update recent activity
    updateRecentActivity();
}

// Animate stat values with count-up effect
function animateStatValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        
        element.textContent = currentValue;
        element.setAttribute('data-target', targetValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update greeting based on time of day
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('greetingText');
    
    if (!greetingElement) return;
    
    let greeting;
    if (hour >= 5 && hour < 12) {
        greeting = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
    } else if (hour >= 17 && hour < 22) {
        greeting = 'Good evening';
    } else {
        greeting = 'Welcome back';
    }
    
    greetingElement.textContent = greeting;
}

// Update Recent Activity
function updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const activities = [
        { icon: 'fa-sticky-note', text: `Added ${appData.notes.length} notes`, time: 'Today', color: 'var(--color-primary)' },
        { icon: 'fa-tasks', text: `${appData.tasks.filter(t => t.status !== 'Done').length} tasks in progress`, time: 'Today', color: 'var(--color-success)' },
        { icon: 'fa-code', text: `${appData.snippets.length} code snippets saved`, time: 'This week', color: 'var(--color-warning)' },
        { icon: 'fa-book', text: `${appData.resources.length} resources bookmarked`, time: 'This week', color: 'var(--color-info)' }
    ];
    
    if (activities.every(a => a.text.match(/\d+/)[0] === '0')) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent activity. Start creating to see your progress!</p></div>';
        return;
    }
    
    container.innerHTML = activities.map((activity, index) => `
        <div class="activity-item" style="animation-delay: ${index * 0.1}s;">
            <div class="activity-icon" style="background: ${activity.color}15; color: ${activity.color};">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Refresh recent activity with animation
function refreshRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        updateRecentActivity();
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
    
    showToast('Activity refreshed', 'success');
}

// Update Current Date
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Update time
    updateCurrentTime();
}

// Update Current Time (live clock)
function updateCurrentTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        timeElement.textContent = `${displayHours}:${minutes} ${period}`;
    }
}

// Start live clock
function startLiveClock() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Display Random Quote
function displayRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (!quoteDisplay) return;
    
    // Fade out
    quoteDisplay.style.opacity = '0';
    quoteDisplay.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        quoteDisplay.innerHTML = `
            <div class="quote-content">
                <i class="fas fa-quote-left quote-icon-left"></i>
                <p class="quote-text">${quote.text}</p>
                <i class="fas fa-quote-right quote-icon-right"></i>
            </div>
            <p class="quote-author">— ${quote.author}</p>
        `;
        
        // Fade in
        quoteDisplay.style.opacity = '1';
        quoteDisplay.style.transform = 'translateY(0)';
    }, 300);
}

// Render All
function renderAll() {
    renderNotes();
    renderTasks();
    renderSnippets();
    renderResources();
    renderSchedule();
    updateWeekOverview();
}

// Render Notes
function renderNotes() {
    const container = document.getElementById('notesContainer');
    if (appData.notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-sticky-note"></i><p>No notes yet. Create your first one!</p></div>';
        return;
    }
    
    container.innerHTML = appData.notes.map(note => `
        <div class="card" style="cursor: pointer; animation: fadeIn 0.6s ease;">
            <h3 style="margin-bottom: var(--space-sm);">${note.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">${note.content.substring(0, 100)}...</p>
            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
                ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Render Tasks
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    if (appData.tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-tasks"></i><p>No tasks yet. Add your first one!</p></div>';
        return;
    }
    
    container.innerHTML = appData.tasks.map(task => `
        <div class="card" style="animation: fadeIn 0.6s ease;">
            <h3 style="margin-bottom: var(--space-sm);">${task.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">${task.description}</p>
            <div style="display: flex; gap: var(--space-md); align-items: center; flex-wrap: wrap;">
                <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                <span style="font-size: 12px; color: var(--text-secondary);"><i class="fas fa-calendar"></i> ${task.dueDate}</span>
                <span style="font-size: 12px; color: var(--text-secondary);">${task.status}</span>
            </div>
        </div>
    `).join('');
}

// Render Snippets
function renderSnippets() {
    const container = document.getElementById('snippetsContainer');
    if (appData.snippets.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-code"></i><p>No code snippets yet. Add your first one!</p></div>';
        return;
    }
    
    container.innerHTML = appData.snippets.map(snippet => `
        <div class="card" style="animation: fadeIn 0.6s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                <h3>${snippet.title}</h3>
                <span class="tag">${snippet.language}</span>
            </div>
            <pre style="background: var(--bg-secondary); padding: var(--space-md); border-radius: var(--radius); overflow-x: auto;"><code>${snippet.code}</code></pre>
        </div>
    `).join('');
}

// Render Resources
function renderResources() {
    const container = document.getElementById('resourcesContainer');
    if (appData.resources.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-book"></i><p>No resources yet. Add your first one!</p></div>';
        return;
    }
    
    container.innerHTML = appData.resources.map(resource => `
        <div class="card" style="cursor: pointer; animation: fadeIn 0.6s ease;" onclick="window.open('${resource.url}', '_blank')">
            <h3 style="margin-bottom: var(--space-sm);">${resource.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md); font-size: 14px;"><i class="fas fa-link"></i> ${resource.url}</p>
            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
                ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Pomodoro Timer
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;

function startPomodoro() {
    if (pomodoroInterval) return;
    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;
        updatePomodoroDisplay();
        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            showToast('Pomodoro session complete! Take a break.', 'success');
        }
    }, 1000);
    showToast('Pomodoro started!', 'success');
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        showToast('Pomodoro paused', 'success');
    }
}

function resetPomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    pomodoroSeconds = 25 * 60;
    updatePomodoroDisplay();
    showToast('Pomodoro reset', 'success');
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroSeconds / 60);
    const seconds = pomodoroSeconds % 60;
    document.getElementById('pomodoroDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Stopwatch
let stopwatchInterval = null;
let stopwatchSeconds = 0;

function startStopwatch() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        updateStopwatchDisplay();
    }, 1000);
}

function pauseStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    stopwatchSeconds = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchSeconds / 3600);
    const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
    const seconds = stopwatchSeconds % 60;
    document.getElementById('stopwatchDisplay').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Countdown
let countdownInterval = null;
let countdownSeconds = 0;

function startCountdown() {
    const minutes = parseInt(document.getElementById('countdownMinutes').value) || 0;
    if (minutes <= 0) {
        showToast('Please enter valid minutes', 'error');
        return;
    }
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownSeconds = minutes * 60;
    
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        updateCountdownDisplay();
        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            showToast('Countdown complete!', 'success');
        }
    }, 1000);
}

function resetCountdown() {
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
    document.getElementById('countdownDisplay').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const clockDisplay = document.getElementById('clockDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    
    if (clockDisplay) clockDisplay.textContent = timeString;
    if (dateDisplay) dateDisplay.textContent = dateString;
}

setInterval(updateClock, 1000);
updateClock();

// Focus Session
function startFocusSession(minutes) {
    showToast(`Starting ${minutes} minute focus session`, 'success');
    // Implement focus session logic
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Search Handler
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    // Implement search logic
    console.log('Searching for:', query);
}

// Render Schedule
function renderSchedule(filterDay = 'all') {
    const container = document.getElementById('scheduleContainer');
    let scheduleItems = appData.schedule;
    
    if (filterDay !== 'all') {
        scheduleItems = scheduleItems.filter(item => item.day === filterDay);
    }
    
    if (scheduleItems.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar"></i><p>No schedule items for this day. Add one to get started!</p></div>';
        return;
    }
    
    // Group by day
    const groupedSchedule = scheduleItems.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
    }, {});
    
    container.innerHTML = Object.keys(groupedSchedule).map(day => `
        <div style="margin-bottom: var(--space-xl);">
            <h4 style="text-transform: capitalize; margin-bottom: var(--space-md); color: var(--accent);">
                <i class="fas fa-calendar-day"></i> ${day}
            </h4>
            ${groupedSchedule[day].map(item => `
                <div class="schedule-item ${item.completed ? 'completed' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div class="schedule-time"><i class="fas fa-clock"></i> ${item.time}</div>
                            <div class="schedule-subject">${item.subject}</div>
                            <div class="schedule-description">${item.description}</div>
                            <div style="display: flex; gap: var(--space-sm); align-items: center; margin-top: var(--space-sm);">
                                <span style="font-size: 12px; color: var(--text-secondary);">
                                    <i class="fas fa-map-marker-alt"></i> ${item.location}
                                </span>
                                <span class="schedule-day-badge">${item.day}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: var(--space-sm);">
                            <button class="btn btn-secondary ripple" onclick="toggleScheduleComplete(${item.id})" 
                                    style="padding: var(--space-sm) var(--space-md);">
                                <i class="fas fa-${item.completed ? 'undo' : 'check'}"></i>
                            </button>
                            <button class="btn btn-secondary ripple" onclick="deleteScheduleItem(${item.id})" 
                                    style="padding: var(--space-sm) var(--space-md);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Update Week Overview
function updateWeekOverview() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let totalItems = 0;
    
    days.forEach(day => {
        const dayItems = appData.schedule.filter(item => item.day === day);
        const count = dayItems.length;
        const completedCount = dayItems.filter(item => item.completed).length;
        
        totalItems += count;
        
        // Update day count
        const dayCountElement = document.querySelector(`.day-card[data-day="${day}"] .day-count`);
        if (dayCountElement) {
            dayCountElement.textContent = count;
            
            // Add visual indicator if no items
            dayCountElement.style.opacity = count === 0 ? '0.5' : '1';
        }
        
        // Update completed count
        const completedElement = document.querySelector(`.day-card[data-day="${day}"] .day-completed`);
        if (completedElement) {
            completedElement.textContent = `✓ ${completedCount}`;
            completedElement.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        
        // Update aria-label for accessibility
        const dayCard = document.querySelector(`.day-card[data-day="${day}"]`);
        if (dayCard) {
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            dayCard.setAttribute('aria-label', `${dayName}: ${count} item${count !== 1 ? 's' : ''}, ${completedCount} completed`);
            
            // Add visual indicator for busy days
            if (count >= 5) {
                dayCard.classList.add('busy-day');
            } else {
                dayCard.classList.remove('busy-day');
            }
        }
    });
    
    // Update total count
    const weekTotalElement = document.getElementById('weekTotal');
    if (weekTotalElement) {
        weekTotalElement.textContent = totalItems;
    }
}

// Filter Schedule
function filterSchedule(day) {
    try {
        // Remove active class from all day cards
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('active');
            card.setAttribute('aria-pressed', 'false');
        });
        
        // Add active class to selected day
        if (day && day !== 'all') {
            const selectedCard = document.querySelector(`.day-card[data-day="${day}"]`);
            if (selectedCard) {
                selectedCard.classList.add('active');
                selectedCard.setAttribute('aria-pressed', 'true');
                
                // Announce filter change
                const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                showToast(`Viewing ${dayName}'s schedule`, 'success');
            }
        } else {
            showToast('Viewing all days', 'success');
        }
        
        // Render filtered schedule
        renderSchedule(day);
    } catch (error) {
        console.error('Error filtering schedule:', error);
        showToast('Error filtering schedule. Please try again.', 'error');
    }
}

// Toggle Schedule Complete
function toggleScheduleComplete(id) {
    try {
        const item = appData.schedule.find(s => s.id === id);
        if (item) {
            item.completed = !item.completed;
            
            // Update displays
            const filterValue = document.getElementById('scheduleFilter')?.value || 'all';
            renderSchedule(filterValue);
            updateWeekOverview();
            
            // Show feedback
            showToast(
                item.completed 
                    ? `✓ ${item.subject} completed!` 
                    : `${item.subject} marked as incomplete`,
                'success'
            );
        } else {
            throw new Error('Schedule item not found');
        }
    } catch (error) {
        console.error('Error toggling schedule item:', error);
        showToast('Error updating schedule item. Please try again.', 'error');
    }
}

// Delete Schedule Item
function deleteScheduleItem(id) {
    if (confirm('Are you sure you want to delete this schedule item?')) {
        appData.schedule = appData.schedule.filter(s => s.id !== id);
        renderSchedule(document.getElementById('scheduleFilter').value);
        updateWeekOverview();
        showToast('Schedule item deleted', 'success');
    }
}

// Add Day Card Click Listeners
function setupDayCardListeners() {
    document.querySelectorAll('.day-card').forEach(card => {
        // Click event
        card.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const scheduleFilter = document.getElementById('scheduleFilter');
            if (scheduleFilter) {
                scheduleFilter.value = day;
            }
            filterSchedule(day);
            
            // Scroll to schedule section
            const scheduleContainer = document.getElementById('scheduleContainer');
            if (scheduleContainer) {
                scheduleContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
        // Keyboard navigation (Enter and Space)
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Arrow key navigation
        card.addEventListener('keydown', function(e) {
            const cards = Array.from(document.querySelectorAll('.day-card'));
            const currentIndex = cards.indexOf(this);
            let targetIndex;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                targetIndex = (currentIndex + 1) % cards.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                targetIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            
            if (targetIndex !== undefined) {
                e.preventDefault();
                cards[targetIndex].focus();
            }
        });
    });
}

// Placeholder functions
function showNoteEditor() { showToast('Note editor opening...', 'success'); }
function showTaskEditor() { showToast('Task editor opening...', 'success'); }
function showSnippetEditor() { showToast('Snippet editor opening...', 'success'); }
function showScheduleEditor() { 
    showToast('Schedule editor opening...', 'success');
    // In a full implementation, this would open a modal with a form
}
function showResourceEditor() { showToast('Resource editor opening...', 'success'); }

// Network Animation Background
function initNetworkAnimation() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// User Profile Functions
function openUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (!modal) return;
    
    // Load saved profile data
    loadUserProfile();
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('userName')?.focus();
    }, 100);
}

function closeUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadUserProfile() {
    // Load from localStorage if available
    const savedProfile = localStorage.getItem('aura-user-profile');
    if (savedProfile) {
        try {
            appData.userProfile = JSON.parse(savedProfile);
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
    
    // Populate form fields
    document.getElementById('userName').value = appData.userProfile.name || '';
    document.getElementById('userEmail').value = appData.userProfile.email || '';
    document.getElementById('userBio').value = appData.userProfile.bio || '';
    document.getElementById('userGoal').value = appData.userProfile.goal || '';
    document.getElementById('userSkills').value = appData.userProfile.skills.join(', ') || '';
    
    // Update avatar icon
    const avatarIcon = document.getElementById('profileAvatarIcon');
    if (avatarIcon) {
        avatarIcon.className = `fas ${appData.userProfile.avatarIcon}`;
    }
}

function saveUserProfile(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const bio = document.getElementById('userBio').value.trim();
    const goal = document.getElementById('userGoal').value.trim();
    const skillsInput = document.getElementById('userSkills').value.trim();
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Validate required fields
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    if (!email) {
        showToast('Please enter your email', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Update profile
    appData.userProfile = {
        ...appData.userProfile,
        name,
        email,
        bio,
        goal,
        skills
    };
    
    // Save to localStorage
    localStorage.setItem('aura-user-profile', JSON.stringify(appData.userProfile));
    
    // Update UI
    updateUserGreeting();
    
    // Close modal
    closeUserProfile();
    
    // Show success message
    showToast('Profile updated successfully!', 'success');
}

function updateUserGreeting() {
    if (appData.userProfile.name) {
        const greetingElement = document.getElementById('greetingText');
        if (greetingElement) {
            const hour = new Date().getHours();
            let greeting;
            if (hour >= 5 && hour < 12) {
                greeting = 'Good morning';
            } else if (hour >= 12 && hour < 17) {
                greeting = 'Good afternoon';
            } else if (hour >= 17 && hour < 22) {
                greeting = 'Good evening';
            } else {
                greeting = 'Welcome back';
            }
            greetingElement.textContent = `${greeting}, ${appData.userProfile.name.split(' ')[0]}`;
        }
    }
}

function changeAvatar() {
    const avatarIcons = [
        'fa-user',
        'fa-user-circle',
        'fa-user-astronaut',
        'fa-user-ninja',
        'fa-user-graduate',
        'fa-user-tie',
        'fa-smile',
        'fa-grin',
        'fa-laugh',
        'fa-grin-stars'
    ];
    
    // Show selection options
    const currentIndex = avatarIcons.indexOf(appData.userProfile.avatarIcon);
    const nextIndex = (currentIndex + 1) % avatarIcons.length;
    appData.userProfile.avatarIcon = avatarIcons[nextIndex];
    
    // Update display
    const avatarIcon = document.getElementById('profileAvatarIcon');
    if (avatarIcon) {
        avatarIcon.className = `fas ${appData.userProfile.avatarIcon}`;
    }
    
    // Update header avatar
    const headerAvatar = document.querySelector('#userAvatar i');
    if (headerAvatar) {
        headerAvatar.className = `fas ${appData.userProfile.avatarIcon}`;
    }
    
    showToast('Avatar updated!', 'success');
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('userProfileModal');
    if (event.target === modal) {
        closeUserProfile();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById('userProfileModal');
        if (modal && modal.style.display === 'flex') {
            closeUserProfile();
        }
    }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupDayCardListeners();
    // Load user profile and update greeting
    const savedProfile = localStorage.getItem('aura-user-profile');
    if (savedProfile) {
        try {
            appData.userProfile = JSON.parse(savedProfile);
            updateUserGreeting();
            // Update header avatar icon
            const headerAvatar = document.querySelector('#userAvatar i');
            if (headerAvatar && appData.userProfile.avatarIcon) {
                headerAvatar.className = `fas ${appData.userProfile.avatarIcon}`;
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
});