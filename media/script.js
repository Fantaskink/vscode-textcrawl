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

// Audio functionality
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('backgroundMusic');
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // Set initial volume
    if (audioElement) {
        audioElement.volume = 0.5;
        
        // Play button functionality
        playButton.addEventListener('click', function() {
            if (audioElement.paused) {
                audioElement.play().then(() => {
                    playButton.textContent = '⏸️ Pause';
                    console.log('Audio started playing');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    // Fallback: try to play a generated tone
                    playGeneratedTone();
                });
            } else {
                audioElement.pause();
                playButton.textContent = '🔊 Play Music';
            }
        });
        
        // Stop button functionality
        stopButton.addEventListener('click', function() {
            audioElement.pause();
            audioElement.currentTime = 0;
            playButton.textContent = '🔊 Play Music';
        });
        
        // Volume control
        volumeSlider.addEventListener('input', function() {
            audioElement.volume = this.value / 100;
        });
        
        // Audio event listeners
        audioElement.addEventListener('play', function() {
            playButton.textContent = '⏸️ Pause';
        });
        
        audioElement.addEventListener('pause', function() {
            playButton.textContent = '🔊 Play Music';
        });
        
        audioElement.addEventListener('ended', function() {
            playButton.textContent = '🔊 Play Music';
        });
    }
});

// Generate a simple tone using Web Audio API if no audio file is available
function playGeneratedTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a simple Star Wars-like fanfare
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A note
        oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.5); // C# note
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 1.0); // E note
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
        
        console.log('Playing generated tone');
    } catch (error) {
        console.error('Error with Web Audio API:', error);
    }
}

// Add keyboard shortcuts for audio control
document.addEventListener('keydown', function(event) {
    const audioElement = document.getElementById('backgroundMusic');
    if (!audioElement) {
        return;
    }
    
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            if (audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
            break;
        case 'KeyM':
            event.preventDefault();
            audioElement.muted = !audioElement.muted;
            break;
        case 'ArrowUp':
            event.preventDefault();
            audioElement.volume = Math.min(1, audioElement.volume + 0.1);
            document.getElementById('volumeSlider').value = audioElement.volume * 100;
            break;
        case 'ArrowDown':
            event.preventDefault();
            audioElement.volume = Math.max(0, audioElement.volume - 0.1);
            document.getElementById('volumeSlider').value = audioElement.volume * 100;
            break;
    }
});
