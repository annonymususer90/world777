async function getLog() {
    const date = document.getElementById('date').value;
    const logContent = document.getElementById('logContent');

    logContent.textContent = 'Fetching log...';

    try {
        const response = await fetch('/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        });

        if (response.ok) {
            const logText = await response.text();
            logContent.textContent = logText;
        } else {
            const errorData = await response.json();
            logContent.textContent = 'Error: ' + errorData.error;
        }
    } catch (error) {
        console.error('Error:', error);
        logContent.textContent = 'An error occurred.';
    }
}
