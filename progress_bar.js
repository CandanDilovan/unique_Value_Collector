
function createProgressInterface() {
    const container = document.createElement('div');
    container.id = 'progress-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: Arial, sans-serif;
        display: none;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        text-align: center;
    `;
    title.textContent = 'Traitement en cours...';

    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar-container';
    progressBar.style.cssText = `
        width: 100%;
        height: 25px;
        background-color: #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 10px;
        border: 1px solid #ddd;
    `;

    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #45a049);
        transition: width 0.4s ease;
        border-radius: 12px;
    `;

    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusMessage.style.cssText = `
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
        min-height: 20px;
    `;

    const detailsText = document.createElement('div');
    detailsText.id = 'details-text';
    detailsText.style.cssText = `
        font-size: 12px;
        color: #777;
        text-align: center;
    `;

    progressBar.appendChild(progressFill);
    container.appendChild(title);
    container.appendChild(statusMessage);
    container.appendChild(progressBar);
    container.appendChild(detailsText);
    document.body.appendChild(container);
}

function showProgress() {
    const container = document.getElementById('progress-container');
    if (container) {
        container.style.display = 'block';
    }
}

function updateProgress(percentage, message, details = '') {
    const fill = document.getElementById('progress-fill');
    const status = document.getElementById('status-message');
    const detailsEl = document.getElementById('details-text');
    
    if (fill) fill.style.width = percentage + '%';
    if (status) status.textContent = message;
    if (detailsEl) detailsEl.textContent = details;
}
