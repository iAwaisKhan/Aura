import { appData } from './state.js';
import { showNotification } from './utils.js';

export function initTechNews() {
    appData.techNews = [
        { id: 1, title: "AI Breakthrough: New Language Model Surpasses GPT-4", source: "TechCrunch", date: "2025-11-24", category: "AI/ML", url: "#", summary: "Researchers announce a groundbreaking AI model with enhanced reasoning capabilities." },
        { id: 2, title: "JavaScript Framework Wars: The Rise of New Contenders", source: "Dev.to", date: "2025-11-23", category: "Web Dev", url: "#", summary: "New lightweight frameworks are challenging React and Vue's dominance." }
    ];
    renderTechNews();
}

export function renderTechNews(newsToRender = null) {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    const newsItems = newsToRender || appData.techNews;
    if (newsItems.length === 0) {
        container.innerHTML = '<div class="empty-state">No tech news available.</div>';
        return;
    }
    
    container.innerHTML = newsItems.map(news => `
        <div class="card news-card">
            <span class="tag">${news.category}</span>
            <h3>${news.title}</h3>
            <p>${news.summary}</p>
            <div class="news-footer">
                <span>${news.source} • ${news.date}</span>
            </div>
        </div>
    `).join('');
}

export function filterNewsByCategory(category) {
    if (category === 'all') {
        renderTechNews();
    } else {
        const filtered = appData.techNews.filter(n => n.category === category);
        renderTechNews(filtered);
    }
}

export function initTechEvents() {
    appData.techEvents = [
        { id: 1, title: "Global Developer Conference", date: "2026-03-15", type: "Conference", location: "Online" },
        { id: 2, title: "Web Performance Webinar", date: "2026-01-20", type: "Webinar", location: "Live Stream" }
    ];
    renderTechEvents();
}

export function renderTechEvents(eventsToRender = null) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    const events = eventsToRender || appData.techEvents;
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state">No tech events found.</div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="card event-card">
            <span class="tag">${event.type}</span>
            <h3>${event.title}</h3>
            <p><i class="fas fa-calendar"></i> ${event.date}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
        </div>
    `).join('');
}

export function filterEventsByType(type) {
    if (type === 'all') {
        renderTechEvents();
    } else {
        const filtered = appData.techEvents.filter(e => e.type === type);
        renderTechEvents(filtered);
    }
}

export function filterEventsByTime(timeFrame) {
    const now = new Date();
    let filtered = [...appData.techEvents];
    if (timeFrame === 'upcoming') {
        filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (timeFrame === 'past') {
        filtered = filtered.filter(e => new Date(e.date) < now);
    }
    renderTechEvents(filtered);
}
