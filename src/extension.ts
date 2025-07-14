// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
		// Create and show a new webview panel
		const panel = vscode.window.createWebviewPanel(
			'textcrawlWebview', // Identifies the type of the webview. Used internally
			'TextCrawl Custom Page', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in
			{
				// Enable scripts in the webview
				enableScripts: true,
				// Restrict the webview to only loading content from our workspace
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
			}
		);

		// Set the HTML content for the webview
		panel.webview.html = getWebviewContent();

		// Handle messages from the webview (optional)
		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text);
						return;
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable, webviewDisposable);
}

// Function to generate HTML content for the webview
function getWebviewContent() {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>TextCrawl Custom Page</title>
		<style>
			body {
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				margin: 0;
				padding: 20px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				min-height: 100vh;
			}

			.container {
				max-width: 800px;
				margin: 0 auto;
				background: rgba(255, 255, 255, 0.1);
				border-radius: 15px;
				padding: 30px;
				backdrop-filter: blur(10px);
				box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
			}

			h1 {
				text-align: center;
				font-size: 2.5em;
				margin-bottom: 20px;
				text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
			}

			.feature-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 20px;
				margin: 30px 0;
			}

			.feature-card {
				background: rgba(255, 255, 255, 0.2);
				border-radius: 10px;
				padding: 20px;
				text-align: center;
				transition: transform 0.3s ease;
			}

			.feature-card:hover {
				transform: translateY(-5px);
			}

			.feature-icon {
				font-size: 3em;
				margin-bottom: 10px;
			}

			button {
				background: linear-gradient(45deg, #ff6b6b, #ee5a24);
				color: white;
				border: none;
				padding: 12px 24px;
				border-radius: 25px;
				font-size: 16px;
				cursor: pointer;
				transition: all 0.3s ease;
				margin: 10px;
			}

			button:hover {
				transform: scale(1.05);
				box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
			}

			.stats {
				display: flex;
				justify-content: space-around;
				margin: 30px 0;
			}

			.stat-item {
				text-align: center;
			}

			.stat-number {
				font-size: 2em;
				font-weight: bold;
				color: #ffd700;
			}

			.footer {
				text-align: center;
				margin-top: 40px;
				opacity: 0.8;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h1>🚀 TextCrawl Extension</h1>
			
			<p style="text-align: center; font-size: 1.2em;">
				Welcome to your custom VS Code extension page! This demonstrates how you can create 
				beautiful, interactive web content within VS Code.
			</p>

			<div class="feature-grid">
				<div class="feature-card">
					<div class="feature-icon">📝</div>
					<h3>Text Processing</h3>
					<p>Advanced text crawling and processing capabilities</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">🔍</div>
					<h3>Smart Search</h3>
					<p>Intelligent search and filtering options</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">⚡</div>
					<h3>Fast Performance</h3>
					<p>Optimized for speed and efficiency</p>
				</div>
			</div>

			<div class="stats">
				<div class="stat-item">
					<div class="stat-number">1,234</div>
					<div>Files Processed</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">56</div>
					<div>Active Projects</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">99.9%</div>
					<div>Uptime</div>
				</div>
			</div>

			<div style="text-align: center;">
				<button onclick="sendMessage()">Send Message to VS Code</button>
				<button onclick="refreshPage()">Refresh Data</button>
			</div>

			<div class="footer">
				<p>Built with ❤️ using VS Code Webview API</p>
			</div>
		</div>

		<script>
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
		</script>
	</body>
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
