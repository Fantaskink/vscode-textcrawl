// Get the VS Code API
const vscode = acquireVsCodeApi();

// Simple Star Wars text crawl functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Star Wars Text Crawl loaded');
    
    // Send a message to the extension that the webview is ready
    vscode.postMessage({
        command: 'alert',
        text: 'Star Wars Text Crawl is now playing! 🌟'
    });
    
    // Optional: Add keyboard shortcuts for extension control
    document.addEventListener('keydown', function(event) {
        switch(event.code) {
            case 'Escape':
                // Stop audio and close
                vscode.postMessage({
                    command: 'stopAudio'
                });
                break;
        }
    });
});

// Handle messages from the extension
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
        case 'updateData':
            console.log('Received data update:', message.data);
            break;
    }
});
