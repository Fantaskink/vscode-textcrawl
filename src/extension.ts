// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-textcrawl" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-textcrawl.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-textcrawl!');
	});

	// Register a new command to show a webview with custom HTML/CSS
	let webviewDisposable = vscode.commands.registerCommand('vscode-textcrawl.showWebview', () => {
		// Start playing audio immediately
		startAudioPlayback(context.extensionUri);
		
		// Create and show a new webview panel in a new window
		const panel = vscode.window.createWebviewPanel(
			'textcrawlWebview', // Identifies the type of the webview. Used internally
			'Star Wars Text Crawl', // Title of the panel displayed to the user
			{
				viewColumn: vscode.ViewColumn.One,
				preserveFocus: false
			}, // Open in new editor group
			{
				// Enable scripts in the webview
				enableScripts: true,
				// Restrict the webview to only loading content from our workspace
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
				// Retain context when hidden
				retainContextWhenHidden: true
			}
		);

		// Set the HTML content for the webview (without audio controls)
		panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

		// Handle messages from the webview (optional)
		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text);
						return;
					case 'stopAudio':
						stopAudioPlayback();
						return;
				}
			},
			undefined,
			context.subscriptions
		);
		
		// Stop audio when panel is closed
		panel.onDidDispose(() => {
			stopAudioPlayback();
		});
	});

	context.subscriptions.push(disposable, webviewDisposable);
}

// Function to generate HTML content for the webview
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	// Get URIs for the CSS and JS files
	const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'script.js'));
	
	// Read the HTML template
	const htmlPath = path.join(extensionUri.fsPath, 'media', 'webview.html');
	let htmlContent = fs.readFileSync(htmlPath, 'utf8');
	
	// Replace placeholders with actual URIs
	htmlContent = htmlContent.replace('{{STYLE_URI}}', styleUri.toString());
	htmlContent = htmlContent.replace('{{SCRIPT_URI}}', scriptUri.toString());
	
	return htmlContent;
}

// Global variable to track audio process
let audioProcess: any = null;
let isAudioStopped = false; // Flag to prevent restart after manual stop

// Function to start audio playback using system commands
function startAudioPlayback(extensionUri: vscode.Uri) {
	// Stop any existing audio first
	stopAudioPlayback();
	
	// Reset the stop flag when starting new audio
	isAudioStopped = false;
	
	const audioPath = path.join(extensionUri.fsPath, 'media', 'audio', 'background.mp3');
	
	// Check if audio file exists
	if (fs.existsSync(audioPath)) {
		console.log(`Found audio file at: ${audioPath}`);
		
		// Use system-specific audio player
		const platform = process.platform;
		let command = '';
		
		if (platform === 'darwin') {
			// macOS - simplified command without infinite loops for now
			command = `afplay "${audioPath}"`;
		} else if (platform === 'win32') {
			// Windows
			command = `powershell -c "(New-Object Media.SoundPlayer '${audioPath}').PlaySync()"`;
		} else {
			// Linux
			command = `aplay "${audioPath}"`;
		}
		
		console.log(`Executing audio command: ${command}`);
		
		audioProcess = exec(command, (error, stdout, stderr) => {
			if (error) {
				// Only show error if it's not due to manual stopping
				if (!isAudioStopped) {
					console.error('Audio playback error:', error.message);
					console.error('stderr:', stderr);
					vscode.window.showErrorMessage(`Audio playback failed: ${error.message}`);
				}
			} else {
				console.log('Audio command completed successfully');
				// For macOS, restart the audio to loop (only if not manually stopped)
				if (platform === 'darwin' && !isAudioStopped) {
					setTimeout(() => {
						if (audioProcess && !isAudioStopped) {
							startAudioPlayback(extensionUri);
						}
					}, 1000);
				}
			}
		});
		
		// Set up process event handlers
		if (audioProcess) {
			audioProcess.on('spawn', () => {
				console.log('Audio process spawned successfully');
				vscode.window.showInformationMessage('🎵 Star Wars music started!');
			});
			
			audioProcess.on('error', (error: Error) => {
				// Only show error if it's not due to manual stopping
				if (!isAudioStopped) {
					console.error('Audio process error:', error);
					vscode.window.showErrorMessage(`Audio process error: ${error.message}`);
				}
			});
		}
		
	} else {
		const message = `Audio file not found at: ${audioPath}`;
		console.error(message);
		vscode.window.showWarningMessage('Audio file not found. Please add background.mp3 to media/audio/');
	}
}

// Function to stop audio playback
function stopAudioPlayback() {
	isAudioStopped = true; // Set flag to prevent restart
	if (audioProcess) {
		audioProcess.kill('SIGTERM'); // Use SIGTERM for graceful termination
		audioProcess = null;
		console.log('Audio playback stopped gracefully');
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
