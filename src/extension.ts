// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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
		panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

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
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	// Get URIs for the CSS and JS files
	const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'script.js'));
	
	// Get URIs for audio files (with fallback if files don't exist)
	const audioUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'audio', 'background.mp3'));
	const audioUriOgg = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'audio', 'background.ogg'));
	
	// Read the HTML template
	const htmlPath = path.join(extensionUri.fsPath, 'media', 'webview.html');
	let htmlContent = fs.readFileSync(htmlPath, 'utf8');
	
	// Replace placeholders with actual URIs
	htmlContent = htmlContent.replace('{{STYLE_URI}}', styleUri.toString());
	htmlContent = htmlContent.replace('{{SCRIPT_URI}}', scriptUri.toString());
	htmlContent = htmlContent.replace('{{AUDIO_URI}}', audioUri.toString());
	htmlContent = htmlContent.replace('{{AUDIO_URI_OGG}}', audioUriOgg.toString());
	
	return htmlContent;
}

// This method is called when your extension is deactivated
export function deactivate() {}
