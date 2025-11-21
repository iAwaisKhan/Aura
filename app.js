
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
    },
    focusMode: {
        streak: 0,
        minutesToday: 0,
        weeklyHours: 0,
        totalSessions: 0,
        lastSessionDate: null,
        sessions: []
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
        // Documentation & References
        { id: 1, title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Documentation", tags: ["html", "css", "javascript"], description: "Comprehensive web development documentation" },
        { id: 2, title: "W3Schools", url: "https://www.w3schools.com", category: "Documentation", tags: ["html", "css", "javascript", "sql"], description: "Easy-to-understand web tutorials" },
        { id: 3, title: "DevDocs", url: "https://devdocs.io", category: "Documentation", tags: ["api", "reference"], description: "All-in-one API documentation browser" },
        { id: 4, title: "Can I Use", url: "https://caniuse.com", category: "Tool", tags: ["browser", "compatibility"], description: "Browser support tables for web technologies" },
        
        // Free Courses & Tutorials
        { id: 5, title: "freeCodeCamp", url: "https://www.freecodecamp.org", category: "Course", tags: ["javascript", "python", "data-science"], description: "Free coding bootcamp with certifications" },
        { id: 6, title: "JavaScript30", url: "https://javascript30.com", category: "Course", tags: ["javascript", "projects"], description: "30 day vanilla JS coding challenge" },
        { id: 7, title: "The Odin Project", url: "https://www.theodinproject.com", category: "Course", tags: ["full-stack", "web-dev"], description: "Free full-stack curriculum" },
        { id: 8, title: "CS50", url: "https://cs50.harvard.edu", category: "Course", tags: ["computer-science", "fundamentals"], description: "Harvard's intro to computer science" },
        { id: 9, title: "Codecademy", url: "https://www.codecademy.com", category: "Course", tags: ["interactive", "multiple-languages"], description: "Interactive coding lessons" },
        { id: 10, title: "Khan Academy", url: "https://www.khanacademy.org/computing", category: "Course", tags: ["programming", "computer-science"], description: "Free CS courses for beginners" },
        
        // Practice & Challenges
        { id: 11, title: "LeetCode", url: "https://leetcode.com", category: "Practice", tags: ["algorithms", "interview-prep"], description: "Coding interview preparation platform" },
        { id: 12, title: "HackerRank", url: "https://www.hackerrank.com", category: "Practice", tags: ["algorithms", "challenges"], description: "Coding challenges and competitions" },
        { id: 13, title: "Codewars", url: "https://www.codewars.com", category: "Practice", tags: ["kata", "multiple-languages"], description: "Code challenges called kata" },
        { id: 14, title: "Exercism", url: "https://exercism.org", category: "Practice", tags: ["mentorship", "practice"], description: "Code practice with mentorship" },
        { id: 15, title: "Frontend Mentor", url: "https://www.frontendmentor.io", category: "Practice", tags: ["frontend", "projects"], description: "Real-world frontend challenges" },
        
        // YouTube Channels
        { id: 16, title: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia", category: "Video", tags: ["web-dev", "tutorials"], description: "Web dev tutorials and crash courses" },
        { id: 17, title: "Fireship", url: "https://www.youtube.com/@Fireship", category: "Video", tags: ["quick-learn", "modern"], description: "Fast-paced modern dev tutorials" },
        { id: 18, title: "Net Ninja", url: "https://www.youtube.com/@NetNinja", category: "Video", tags: ["web-dev", "series"], description: "In-depth web development series" },
        { id: 19, title: "Web Dev Simplified", url: "https://www.youtube.com/@WebDevSimplified", category: "Video", tags: ["javascript", "tutorials"], description: "Simplified web development concepts" },
        { id: 20, title: "Kevin Powell", url: "https://www.youtube.com/@KevinPowell", category: "Video", tags: ["css", "design"], description: "CSS expert tutorials" },
        
        // Tools & Resources
        { id: 21, title: "GitHub", url: "https://github.com", category: "Tool", tags: ["version-control", "collaboration"], description: "Code hosting and collaboration platform" },
        { id: 22, title: "Stack Overflow", url: "https://stackoverflow.com", category: "Community", tags: ["q&a", "help"], description: "Q&A community for developers" },
        { id: 23, title: "CodePen", url: "https://codepen.io", category: "Tool", tags: ["frontend", "sandbox"], description: "Online code editor and playground" },
        { id: 24, title: "Replit", url: "https://replit.com", category: "Tool", tags: ["ide", "collaboration"], description: "Online collaborative IDE" },
        { id: 25, title: "Regex101", url: "https://regex101.com", category: "Tool", tags: ["regex", "testing"], description: "Regular expression tester" },
        
        // Design & UI/UX
        { id: 26, title: "Dribbble", url: "https://dribbble.com", category: "Design", tags: ["inspiration", "ui"], description: "Design inspiration community" },
        { id: 27, title: "Figma", url: "https://www.figma.com", category: "Tool", tags: ["design", "prototyping"], description: "Collaborative design tool" },
        { id: 28, title: "Coolors", url: "https://coolors.co", category: "Tool", tags: ["color", "palette"], description: "Color palette generator" },
        { id: 29, title: "Google Fonts", url: "https://fonts.google.com", category: "Resource", tags: ["typography", "fonts"], description: "Free web fonts library" },
        { id: 30, title: "Font Awesome", url: "https://fontawesome.com", category: "Resource", tags: ["icons", "ui"], description: "Icon library and toolkit" },
        
        // Blogs & Articles
        { id: 31, title: "CSS-Tricks", url: "https://css-tricks.com", category: "Blog", tags: ["css", "frontend"], description: "Web design and development articles" },
        { id: 32, title: "Smashing Magazine", url: "https://www.smashingmagazine.com", category: "Blog", tags: ["web-design", "development"], description: "Professional web design magazine" },
        { id: 33, title: "Dev.to", url: "https://dev.to", category: "Community", tags: ["articles", "discussions"], description: "Developer blogging community" },
        { id: 34, title: "Medium - Programming", url: "https://medium.com/tag/programming", category: "Blog", tags: ["articles", "tutorials"], description: "Programming articles and stories" },
        
        // Cheat Sheets & Quick References
        { id: 35, title: "OverAPI", url: "https://overapi.com", category: "Reference", tags: ["cheatsheets", "quick-reference"], description: "Collecting all cheat sheets" },
        { id: 36, title: "Cheatography", url: "https://cheatography.com/programming", category: "Reference", tags: ["cheatsheets", "programming"], description: "Programming cheat sheets" },
        { id: 37, title: "Awesome Lists", url: "https://github.com/sindresorhus/awesome", category: "Resource", tags: ["curated", "lists"], description: "Curated lists of awesome resources" },
        
        // Specialized Learning
        { id: 38, title: "React Official Docs", url: "https://react.dev", category: "Documentation", tags: ["react", "javascript"], description: "Official React documentation" },
        { id: 39, title: "Vue.js Guide", url: "https://vuejs.org/guide", category: "Documentation", tags: ["vue", "javascript"], description: "Official Vue.js guide" },
        { id: 40, title: "Node.js Docs", url: "https://nodejs.org/docs", category: "Documentation", tags: ["nodejs", "backend"], description: "Official Node.js documentation" },
        { id: 41, title: "Python.org", url: "https://www.python.org", category: "Documentation", tags: ["python", "programming"], description: "Official Python documentation" },
        { id: 42, title: "Rust Book", url: "https://doc.rust-lang.org/book", category: "Documentation", tags: ["rust", "systems"], description: "The official Rust programming book" },
        
        // Career & Interview Prep
        { id: 43, title: "Pramp", url: "https://www.pramp.com", category: "Practice", tags: ["interview", "mock"], description: "Free mock interviews with peers" },
        { id: 44, title: "Interview Cake", url: "https://www.interviewcake.com", category: "Course", tags: ["interview", "algorithms"], description: "Programming interview preparation" },
        { id: 45, title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org", category: "Resource", tags: ["interview", "guide"], description: "Free curated interview preparation" },
        
        // Accessibility
        { id: 46, title: "WebAIM", url: "https://webaim.org", category: "Resource", tags: ["accessibility", "a11y"], description: "Web accessibility resources" },
        { id: 47, title: "A11y Project", url: "https://www.a11yproject.com", category: "Resource", tags: ["accessibility", "checklist"], description: "Community-driven accessibility resources" },
        
        // News & Updates
        { id: 48, title: "Hacker News", url: "https://news.ycombinator.com", category: "News", tags: ["tech", "startup"], description: "Tech and startup news" },
        { id: 49, title: "JavaScript Weekly", url: "https://javascriptweekly.com", category: "Newsletter", tags: ["javascript", "updates"], description: "Weekly JavaScript newsletter" },
        { id: 50, title: "CSS Weekly", url: "https://css-weekly.com", category: "Newsletter", tags: ["css", "updates"], description: "Weekly CSS newsletter" }
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
function renderResources(resourcesToRender = null) {
    const container = document.getElementById('resourcesContainer');
    const resources = resourcesToRender || appData.resources;
    
    if (resources.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-book"></i><p>No resources found. Try adjusting your filters!</p></div>';
        updateResourceCount(0);
        return;
    }
    
    container.innerHTML = resources.map((resource, index) => {
        const categoryIcon = getCategoryIcon(resource.category);
        const categoryColor = getCategoryColor(resource.category);
        
        return `
            <div class="card resource-card" style="animation: fadeIn 0.6s ease ${index * 0.05}s; animation-fill-mode: both; opacity: 0;" onclick="window.open('${resource.url}', '_blank')">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-md);">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                        <div class="resource-category-icon" style="background: ${categoryColor}15; color: ${categoryColor};">
                            <i class="fas ${categoryIcon}"></i>
                        </div>
                        <span class="resource-category-badge" style="background: ${categoryColor}15; color: ${categoryColor};">${resource.category}</span>
                    </div>
                    <button class="btn-icon ripple" onclick="event.stopPropagation(); bookmarkResource(${resource.id})" title="Bookmark" style="opacity: 0.6;">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
                
                <h3 style="margin-bottom: var(--space-sm); color: var(--color-text);">${resource.title}</h3>
                
                ${resource.description ? `<p style="color: var(--color-text-secondary); margin-bottom: var(--space-md); font-size: var(--font-size-sm); line-height: 1.5;">${resource.description}</p>` : ''}
                
                <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                    <i class="fas fa-external-link-alt"></i>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${resource.url}</span>
                </div>
                
                <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
                    ${resource.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${resource.tags.length > 4 ? `<span class="tag">+${resource.tags.length - 4}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    updateResourceCount(resources.length);
}

function getCategoryIcon(category) {
    const icons = {
        'Documentation': 'fa-book',
        'Course': 'fa-graduation-cap',
        'Practice': 'fa-code',
        'Video': 'fa-video',
        'Tool': 'fa-tools',
        'Community': 'fa-users',
        'Design': 'fa-palette',
        'Blog': 'fa-rss',
        'Reference': 'fa-file-alt',
        'Resource': 'fa-folder',
        'News': 'fa-newspaper',
        'Newsletter': 'fa-envelope'
    };
    return icons[category] || 'fa-link';
}

function getCategoryColor(category) {
    const colors = {
        'Documentation': '#3b82f6',
        'Course': '#10b981',
        'Practice': '#8b5cf6',
        'Video': '#ef4444',
        'Tool': '#f59e0b',
        'Community': '#ec4899',
        'Design': '#06b6d4',
        'Blog': '#6366f1',
        'Reference': '#14b8a6',
        'Resource': '#84cc16',
        'News': '#f97316',
        'Newsletter': '#a855f7'
    };
    return colors[category] || 'var(--color-primary)';
}

function updateResourceCount(count) {
    const countElement = document.getElementById('resourceCount');
    if (countElement) {
        countElement.textContent = `Showing ${count} resource${count !== 1 ? 's' : ''} of ${appData.resources.length} total`;
    }
}

function filterResources() {
    const searchTerm = document.getElementById('resourceSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('resourceCategoryFilter')?.value || 'all';
    
    let filtered = appData.resources;
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(r => {
            return r.title.toLowerCase().includes(searchTerm) ||
                   r.url.toLowerCase().includes(searchTerm) ||
                   r.category.toLowerCase().includes(searchTerm) ||
                   (r.description && r.description.toLowerCase().includes(searchTerm)) ||
                   r.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
    }
    
    renderResources(filtered);
}

function resetResourceFilters() {
    const searchInput = document.getElementById('resourceSearch');
    const categorySelect = document.getElementById('resourceCategoryFilter');
    
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'all';
    
    renderResources();
    showToast('Filters reset', 'success');
}

function bookmarkResource(id) {
    showToast('Resource bookmarked!', 'success');
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

// Focus Mode Variables
let focusInterval = null;
let focusSecondsRemaining = 0;
let focusSessionMinutes = 0;
let focusStartTime = null;
let focusPaused = false;

// Load Focus Data
function loadFocusData() {
    const saved = localStorage.getItem('aura-focus-data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appData.focusMode = { ...appData.focusMode, ...data };
            
            // Check if last session was today
            const today = new Date().toDateString();
            if (appData.focusMode.lastSessionDate !== today) {
                appData.focusMode.minutesToday = 0;
            }
            
            // Calculate weekly hours
            calculateWeeklyHours();
            updateFocusStats();
        } catch (e) {
            console.error('Error loading focus data:', e);
        }
    }
}

// Save Focus Data
function saveFocusData() {
    localStorage.setItem('aura-focus-data', JSON.stringify(appData.focusMode));
}

// Calculate Weekly Hours
function calculateWeeklyHours() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSessions = appData.focusMode.sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= oneWeekAgo;
    });
    
    const totalMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    appData.focusMode.weeklyHours = (totalMinutes / 60).toFixed(1);
}

// Update Focus Stats Display
function updateFocusStats() {
    const streakEl = document.getElementById('focusStreak');
    const minutesEl = document.getElementById('minutesToday');
    const hoursEl = document.getElementById('weeklyHours');
    
    if (streakEl) animateStatValue('focusStreak', appData.focusMode.streak);
    if (minutesEl) animateStatValue('minutesToday', appData.focusMode.minutesToday);
    if (hoursEl) {
        hoursEl.textContent = appData.focusMode.weeklyHours;
        hoursEl.setAttribute('data-target', appData.focusMode.weeklyHours);
    }
}

// Start Focus Session
function startFocusSession(minutes) {
    // Check if session already running
    if (focusInterval) {
        showToast('A focus session is already running!', 'error');
        return;
    }
    
    focusSessionMinutes = minutes;
    focusSecondsRemaining = minutes * 60;
    focusStartTime = new Date();
    focusPaused = false;
    
    // Show focus modal
    showFocusModal();
    
    // Start timer
    focusInterval = setInterval(() => {
        if (!focusPaused) {
            focusSecondsRemaining--;
            updateFocusDisplay();
            
            if (focusSecondsRemaining <= 0) {
                completeFocusSession();
            }
        }
    }, 1000);
    
    showToast(`${minutes} minute focus session started!`, 'success');
}

// Update Focus Display
function updateFocusDisplay() {
    const display = document.getElementById('focusTimerDisplay');
    if (!display) return;
    
    const minutes = Math.floor(focusSecondsRemaining / 60);
    const seconds = focusSecondsRemaining % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const totalSeconds = focusSessionMinutes * 60;
    const progress = ((totalSeconds - focusSecondsRemaining) / totalSeconds) * 100;
    const progressBar = document.getElementById('focusProgressBar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Pause Focus Session
function pauseFocusSession() {
    if (!focusInterval) return;
    
    focusPaused = !focusPaused;
    const pauseBtn = document.querySelector('#focusPauseBtn i');
    const pauseText = document.querySelector('#focusPauseBtn span');
    
    if (focusPaused) {
        if (pauseBtn) pauseBtn.className = 'fas fa-play';
        if (pauseText) pauseText.textContent = 'Resume';
        showToast('Focus session paused', 'info');
    } else {
        if (pauseBtn) pauseBtn.className = 'fas fa-pause';
        if (pauseText) pauseText.textContent = 'Pause';
        showToast('Focus session resumed', 'success');
    }
}

// Stop Focus Session
function stopFocusSession() {
    if (!focusInterval) return;
    
    if (confirm('Are you sure you want to end this focus session early?')) {
        const minutesCompleted = Math.floor((focusSessionMinutes * 60 - focusSecondsRemaining) / 60);
        
        if (minutesCompleted > 0) {
            recordPartialSession(minutesCompleted);
        }
        
        clearInterval(focusInterval);
        focusInterval = null;
        closeFocusModal();
        showToast(`Session ended. ${minutesCompleted} minutes completed.`, 'info');
    }
}

// Complete Focus Session
function completeFocusSession() {
    clearInterval(focusInterval);
    focusInterval = null;
    
    // Update stats
    const today = new Date().toDateString();
    appData.focusMode.minutesToday += focusSessionMinutes;
    appData.focusMode.totalSessions++;
    
    // Update streak
    if (appData.focusMode.lastSessionDate === today) {
        // Same day, don't change streak
    } else if (isConsecutiveDay(appData.focusMode.lastSessionDate)) {
        appData.focusMode.streak++;
    } else {
        appData.focusMode.streak = 1;
    }
    
    appData.focusMode.lastSessionDate = today;
    
    // Record session
    appData.focusMode.sessions.push({
        date: new Date().toISOString(),
        duration: focusSessionMinutes,
        completed: true
    });
    
    // Keep only last 30 days of sessions
    if (appData.focusMode.sessions.length > 100) {
        appData.focusMode.sessions = appData.focusMode.sessions.slice(-100);
    }
    
    calculateWeeklyHours();
    saveFocusData();
    updateFocusStats();
    
    // Show completion message
    showFocusCompletionModal();
    closeFocusModal();
}

// Record Partial Session
function recordPartialSession(minutes) {
    const today = new Date().toDateString();
    appData.focusMode.minutesToday += minutes;
    appData.focusMode.lastSessionDate = today;
    
    appData.focusMode.sessions.push({
        date: new Date().toISOString(),
        duration: minutes,
        completed: false
    });
    
    calculateWeeklyHours();
    saveFocusData();
    updateFocusStats();
}

// Check Consecutive Day
function isConsecutiveDay(lastDateString) {
    if (!lastDateString) return false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDateString === yesterday.toDateString();
}

// Show Focus Modal
function showFocusModal() {
    const modal = document.getElementById('focusSessionModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateFocusDisplay();
    }
}

// Close Focus Modal
function closeFocusModal() {
    const modal = document.getElementById('focusSessionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Show Focus Completion Modal
function showFocusCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center; max-width: 500px;">
            <div style="font-size: 64px; margin: var(--space-24) 0;">🎉</div>
            <h2 style="margin-bottom: var(--space-16); color: var(--color-text);">Focus Session Complete!</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24); font-size: var(--font-size-lg);">
                Great job! You completed a ${focusSessionMinutes}-minute focus session.
            </p>
            <div class="stats-grid" style="margin-bottom: var(--space-24);">
                <div class="stat-card card">
                    <div class="stat-value">${appData.focusMode.streak}</div>
                    <div class="stat-label">Day Streak</div>
                </div>
                <div class="stat-card card">
                    <div class="stat-value">${appData.focusMode.minutesToday}</div>
                    <div class="stat-label">Minutes Today</div>
                </div>
            </div>
            <button class="btn ripple" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';" style="width: 100%;">
                <i class="fas fa-check"></i> Awesome!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Play success sound (optional - requires audio file)
    playSuccessSound();
    
    // Confetti effect
    triggerConfetti();
}

// Play Success Sound
function playSuccessSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKjo77pjHwU7k9nzxnkqBSh+zPLaizsKG2S56+mmVRIJSKHh8bllHgU1ic/y1Ic1Bxptv/DinUwND1Cq6O+7Yh4FOpPY88p2KwUrfsvx3Is1CRxguur0pV0UCkij4fG5ZBwFM4nO8diIOQccZr3v4J1MDA5Qq+juvWEfBTuS2PPJdysFK3/M8dqLNgkcYbro9KVdFApIo+HxuWQcBTOJzvHYiDkHHGa97+CdTAwOUKvo7r1hHwU7ktjzyXcrBSt/zPHaizYJHGG66PSlXRQKSKPh8blkHAUzic7x2Ig5Bxxmve/gnUwMDlCr6O69YR8FO5LY88l3KwUrf8zx2os2CRxhuuj0pV0UCkij4fG5ZBwFM4nO8diIOQccZr3v4J1MDA5Qq+juvWEfBTuS2PPJdysFK3/M8dqLNgkcYbro9KVdFApIo+HxuWQcBTOJzvHYiDkHHGa97+CdTAwOUKvo7r1hHwU7ktjzyXcrBSt/zPHaizYJHGG66PSlXRQKSKPh8blkHAUzic7x2Ig5Bxxmve/gnUwMDlCr6O69YR8FO5LY88l3KwUrf8zx2os2CRxhuuj0pV0UCkij4fG5ZBwFM4nO8diIOQccZr3v4J1MDA5Qq+juvWEfBTuS2PPJdysFK3/M8dqLNgkcYbro9KVdFApIo+HxuWQcBTOJzvHYiDkHHGa97+CdTAwOUKvo');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// Trigger Confetti Effect
function triggerConfetti() {
    // Simple confetti effect using CSS animations
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.backgroundColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)];
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
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

// Start Custom Focus Session
function startCustomFocusSession() {
    const input = document.getElementById('customFocusMinutes');
    const minutes = parseInt(input?.value);
    
    if (!minutes || minutes < 1) {
        showToast('Please enter a valid duration (1-180 minutes)', 'error');
        return;
    }
    
    if (minutes > 180) {
        showToast('Maximum session duration is 180 minutes', 'error');
        return;
    }
    
    startFocusSession(minutes);
    if (input) input.value = '';
}

// View Focus History
function viewFocusHistory() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const recentSessions = appData.focusMode.sessions.slice(-10).reverse();
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Focus History</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${recentSessions.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>No focus sessions yet. Start your first session!</p>
                    </div>
                ` : `
                    <div style="margin-bottom: var(--space-lg);">
                        <h3 style="margin-bottom: var(--space-md);">Recent Sessions</h3>
                        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                            ${recentSessions.map(session => {
                                const date = new Date(session.date);
                                const dateStr = date.toLocaleDateString();
                                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return `
                                    <div class="card" style="padding: var(--space-16);">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight: var(--font-weight-medium); margin-bottom: var(--space-4);">
                                                    ${session.duration} minutes
                                                    ${session.completed ? 
                                                        '<i class="fas fa-check-circle" style="color: var(--color-success); margin-left: var(--space-4);"></i>' : 
                                                        '<i class="fas fa-clock" style="color: var(--color-warning); margin-left: var(--space-4);"></i>'}
                                                </div>
                                                <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                                                    ${dateStr} at ${timeStr}
                                                </div>
                                            </div>
                                            <div style="text-align: right;">
                                                <span class="tag" style="background: ${session.completed ? 'var(--color-success)' : 'var(--color-warning)'}15; color: ${session.completed ? 'var(--color-success)' : 'var(--color-warning)'}; border: 1px solid currentColor;">
                                                    ${session.completed ? 'Completed' : 'Partial'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Update total sessions display
function updateTotalSessions() {
    const element = document.getElementById('totalSessions');
    if (element) {
        element.textContent = appData.focusMode.totalSessions;
    }
}

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
    
    // Load focus mode data
    loadFocusData();
    updateTotalSessions();
});