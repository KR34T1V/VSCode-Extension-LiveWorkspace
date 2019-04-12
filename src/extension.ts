import * as vscode from 'vscode';
import * as command from './commands';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        command.commandRefresh();
    });
	context.subscriptions.push(disposable);
}

export function deactivate() {}
