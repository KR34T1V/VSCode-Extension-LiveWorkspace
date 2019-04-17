import * as vscode from 'vscode';
import { FtpTreeDataProvider, FtpExplorer } from './commands/';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        new FtpExplorer(context);
    });
	context.subscriptions.push(disposable);
}

export function deactivate() {}
