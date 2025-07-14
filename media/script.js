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

// Audio autoplay functionality with user interaction
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('backgroundMusic');
    const startOverlay = document.getElementById('startOverlay');
    let audioStarted = false;
    
    // Handle the start overlay click
    if (startOverlay) {
        startOverlay.addEventListener('click', function() {
            startAudioExperience();
        });
        
        // Also allow keyboard interaction
        document.addEventListener('keydown', function(e) {
            if (!audioStarted) {
                startAudioExperience();
            }
        });
    }
    
    function startAudioExperience() {
        if (audioStarted) {
            return;
        }
        audioStarted = true;
        
        // Hide the overlay
        startOverlay.classList.add('hidden');
        
        if (audioElement) {
            // Set volume to a comfortable level
            audioElement.volume = 0.4;
            
            // Try to play the audio
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio started playing successfully');
                }).catch(error => {
                    console.log('Audio file not available, using generated music:', error);
                    playGeneratedMusic();
                });
            } else {
                // Fallback for older browsers
                setTimeout(() => {
                    if (audioElement.paused) {
                        console.log('Audio file not available, using generated music');
                        playGeneratedMusic();
                    }
                }, 1000);
            }
        } else {
            console.log('No audio element found, using generated music');
            playGeneratedMusic();
        }
    }
    
    // Enhanced audio error handling
    if (audioElement) {
        audioElement.addEventListener('error', function(e) {
            console.log('Audio error occurred:', e);
            if (audioStarted) {
                playGeneratedMusic();
            }
        });
        
        audioElement.addEventListener('canplay', function() {
            console.log('Audio file loaded and ready');
        });
    }
});

// Generate a continuous Star Wars-like theme using Web Audio API
function playGeneratedMusic() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a more elaborate Star Wars-inspired theme
        function createNote(frequency, startTime, duration, volume = 0.1, waveType = 'sine') {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, startTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.1);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        }
        
        // Main theme melody (simplified Star Wars main theme rhythm)
        const playTheme = (startTime) => {
            // Main fanfare
            createNote(392, startTime, 1.5, 0.15); // G
            createNote(392, startTime + 1.5, 1.5, 0.15); // G
            createNote(392, startTime + 3, 1.5, 0.15); // G
            createNote(311.13, startTime + 4.5, 2, 0.2); // Eb
            createNote(466.16, startTime + 6, 0.5, 0.15); // Bb
            
            createNote(392, startTime + 6.5, 1.5, 0.15); // G
            createNote(311.13, startTime + 8, 2, 0.2); // Eb
            createNote(466.16, startTime + 9.5, 0.5, 0.15); // Bb
            createNote(392, startTime + 10, 3, 0.2); // G
        };
        
        // Play the theme and loop it
        const themeDuration = 13;
        let currentTime = audioContext.currentTime;
        
        // Play multiple iterations
        for (let i = 0; i < 10; i++) {
            playTheme(currentTime + (i * themeDuration));
        }
        
        console.log('Playing generated Star Wars-style theme music');
        
        // Schedule the next loop
        setTimeout(() => {
            if (audioContext.state === 'running') {
                playGeneratedMusic();
            }
        }, themeDuration * 10 * 1000);
        
    } catch (error) {
        console.error('Error with Web Audio API:', error);
    }
}
