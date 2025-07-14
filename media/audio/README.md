# Audio Setup for TextCrawl Extension

## Adding Audio Files

To enable audio playback in your Star Wars text crawl, place audio files in the `media/audio/` directory:

### Supported Formats:
- `background.mp3` - Main background music file
- `background.ogg` - Fallback format for better browser compatibility

### Recommended Audio:
For the authentic Star Wars experience, you can use:
- Star Wars Main Theme music
- Any epic orchestral music
- Custom sound effects

### File Setup:
1. Create audio files with names: `background.mp3` and `background.ogg`
2. Place them in the `media/audio/` directory
3. The extension will automatically detect and use them

### Fallback:
If no audio files are found, the extension will generate a simple synthetic tone using the Web Audio API.

## Audio Controls:

### Mouse Controls:
- **Play/Pause Button**: Start or pause the background music
- **Stop Button**: Stop and reset the audio
- **Volume Slider**: Adjust playback volume

### Keyboard Shortcuts:
- **Spacebar**: Play/Pause audio
- **M**: Mute/Unmute audio
- **Arrow Up**: Increase volume
- **Arrow Down**: Decrease volume

## Features:
- Looping background music
- Volume control
- Responsive audio controls
- Cross-browser compatibility
- Automatic fallback for missing files
