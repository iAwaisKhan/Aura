import { appData } from './state.js';
import { escapeHTML, showNotification } from './utils.js';
import { saveAllData } from './storage.js';
import { updateDashboard } from './dashboard.js';
import { updateProductivityStats } from './productivity.js';

export function renderTasks(tasksToRender = null) {
    const container = document.getElementById('tasksContainer');
    if (!container) return;

    let tasks = tasksToRender || appData.tasks;
    
    if (!tasksToRender && appData.settings && !appData.settings.showCompleted) {
        tasks = tasks.filter(task => task.status !== 'Done');
    }
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-tasks"></i><p>No tasks found. Try adjusting your filters!</p></div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => {
        const safeTitle = escapeHTML(task.title || 'Untitled task');
        const safeDescription = escapeHTML(task.description || '');
        const safePriority = escapeHTML(task.priority || 'Low');
        const safeDueDate = escapeHTML(task.dueDate || 'No due date');
        const safeStatus = escapeHTML(task.status || 'To Do');
        const priorityClass = (task.priority || 'Low').toLowerCase();
        const doneStyle = task.status === 'Done' ? 'text-decoration: line-through; opacity: 0.6;' : '';
        return `
            <div class="card" style="animation: fadeIn 0.6s ease;">
                <div style="display: flex; align-items: flex-start; gap: var(--space-12); margin-bottom: var(--space-12);">
                    <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.status === 'Done' ? 'checked' : ''}>
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: var(--space-8); ${doneStyle}">${safeTitle}</h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-12); font-size: var(--font-size-sm);">${safeDescription}</p>
                        <div style="display: flex; gap: var(--space-8); align-items: center; flex-wrap: wrap;">
                            <span class="priority-badge priority-${priorityClass}">${safePriority}</span>
                            <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);"><i class="fas fa-calendar"></i> ${safeDueDate}</span>
                            <span class="tag" style="font-size: var(--font-size-xs);">${safeStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

export function toggleTaskComplete(taskId) {
    const task = appData.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'Done' ? 'To Do' : 'Done';
        task.completedDate = task.status === 'Done' ? new Date().toISOString() : null;
        saveAllData();
        renderTasks();
        updateDashboard();
        updateProductivityStats();
        showNotification(task.status === 'Done' ? 'Task done!' : 'Task reopened', 'success', 2000);
    }
}

export function filterTasks(filter) {
    let filtered = [...appData.tasks];
    switch (filter) {
        case 'active': filtered = filtered.filter(t => t.status !== 'Done'); break;
        case 'completed': filtered = filtered.filter(t => t.status === 'Done'); break;
        case 'high': filtered = filtered.filter(t => t.priority === 'High'); break;
        case 'today': 
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.dueDate === today);
            break;
    }
    renderTasks(filtered);
}

export function sortTasks(sortBy) {
    let sorted = [...appData.tasks];
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    switch (sortBy) {
        case 'priority': sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]); break;
        case 'dueDate': sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); break;
        case 'status': sorted.sort((a, b) => a.status.localeCompare(b.status)); break;
    }
    renderTasks(sorted);
}

export function selectAllTasks() {
    document.querySelectorAll('.task-checkbox').forEach(cb => cb.checked = true);
}

export function markSelectedTasksComplete() {
    const checkboxes = document.querySelectorAll('.task-checkbox:checked');
    if (checkboxes.length === 0) {
        showNotification('No tasks selected', 'info', 2000);
        return;
    }
    checkboxes.forEach(cb => {
        const taskId = parseInt(cb.dataset.taskId);
        const task = appData.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'Done';
            task.completedDate = new Date().toISOString();
        }
    });
    saveAllData();
    renderTasks();
    updateDashboard();
    updateProductivityStats();
    showNotification(`${checkboxes.length} task(s) marked complete`, 'success', 2000);
}

export function deleteSelectedTasks() {
    const checkboxes = document.querySelectorAll('.task-checkbox:checked');
    if (checkboxes.length === 0) {
        showNotification('No tasks selected', 'info', 2000);
        return;
    }
    if (confirm(`Are you sure you want to delete ${checkboxes.length} tasks?`)) {
        const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.taskId));
        appData.tasks = appData.tasks.filter(t => !idsToDelete.includes(t.id));
        saveAllData();
        renderTasks();
        updateDashboard();
        showNotification(`${checkboxes.length} task(s) deleted`, 'success', 2000);
    }
}

export function showTaskEditor() {
    showNotification('Task editor coming soon!', 'info');
}
