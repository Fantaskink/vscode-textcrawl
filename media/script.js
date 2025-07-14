// Get the VS Code API
const vscode = acquireVsCodeApi();

function sendMessage() {
	vscode.postMessage({
		command: 'alert',
		text: 'Hello from the webview! 🎉'
	});
}

function refreshPage() {
	// Simulate data refresh
	const statNumbers = document.querySelectorAll('.stat-number');
	statNumbers.forEach(stat => {
		const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
		const newValue = Math.floor(Math.random() * 1000) + currentValue;
		stat.textContent = newValue.toLocaleString();
	});
}

// Example of handling messages from the extension
window.addEventListener('message', event => {
	const message = event.data;
	switch (message.type) {
		case 'updateData':
			// Handle data updates from the extension
			console.log('Received data update:', message.data);
			break;
	}
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', function() {
	// Add click animations to feature cards
	const featureCards = document.querySelectorAll('.feature-card');
	featureCards.forEach(card => {
		card.addEventListener('click', function() {
			this.style.transform = 'scale(0.95)';
			setTimeout(() => {
				this.style.transform = '';
			}, 150);
		});
	});
});
