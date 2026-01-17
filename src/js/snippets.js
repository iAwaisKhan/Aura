import { appData } from './state.js';
import { escapeHTML, showNotification } from './utils.js';

export function renderSnippets() {
    const container = document.getElementById('snippetsContainer');
    if (!container) return;

    if (appData.snippets.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-code"></i><p>No code snippets yet. Add your first one!</p></div>';
        return;
    }
    
    container.innerHTML = appData.snippets.map(snippet => {
        const safeTitle = escapeHTML(snippet.title || 'Untitled snippet');
        const safeLanguage = escapeHTML(snippet.language || 'Code');
        const safeCode = escapeHTML(snippet.code || '');
        return `
            <div class="card" style="animation: fadeIn 0.6s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                    <h3>${safeTitle}</h3>
                    <div style="display: flex; gap: var(--space-sm);">
                        <span class="tag">${safeLanguage}</span>
                        <button class="btn btn-secondary btn-sm" onclick="copySnippet(\`${safeCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <pre style="background: var(--color-background); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--color-border); overflow-x: auto; font-family: var(--font-family-mono); font-size: var(--font-size-sm);"><code>${safeCode}</code></pre>
            </div>
        `;
    }).join('');
}

export function showSnippetEditor() {
    showNotification('Snippet editor coming soon!', 'info');
}

export function copySnippet(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    });
}
