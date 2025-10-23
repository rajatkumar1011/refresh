document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const intervalInput = document.getElementById('intervalInput');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const statusEl = document.getElementById('status');
    const targetFrame = document.getElementById('targetFrame');

    let refreshTimer = null;
    let refreshCount = 0;

    function startRefreshing() {
        const url = urlInput.value.trim();
        const interval = parseInt(intervalInput.value, 10);

        // Basic validation
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
            statusEl.textContent = 'Invalid URL (must start with http/https)';
            return;
        }

        if (isNaN(interval) || interval < 1) {
            statusEl.textContent = 'Invalid interval (min 1s)';
            return;
        }

        // Update UI state
        startButton.disabled = true;
        stopButton.disabled = false;
        urlInput.disabled = true;
        intervalInput.disabled = true;
        refreshCount = 0;
        statusEl.textContent = 'Running...';

        const loadUrl = () => {
            // Add a cache-busting query parameter to ensure a fresh load
            const cacheBustUrl = `${url}${(url.includes('?') ? '&' : '?')}_t=${new Date().getTime()}`;
            targetFrame.src = cacheBustUrl;
            refreshCount++;
            statusEl.textContent = `Running... (Refreshed ${refreshCount} times)`;
        };

        // Load immediately on start
        loadUrl();

        // Start the refresh interval
        refreshTimer = setInterval(loadUrl, interval * 1000);
    }

    function stopRefreshing() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }

        // Update UI state
        startButton.disabled = false;
        stopButton.disabled = true;
        urlInput.disabled = false;
        intervalInput.disabled = false;
        statusEl.textContent = `Idle (Stopped after ${refreshCount} refreshes)`;
    }

    // Attach event listeners
    startButton.addEventListener('click', startRefreshing);
    stopButton.addEventListener('click', stopRefreshing);
});
