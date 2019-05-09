import * as vscode from 'vscode';
import { FtpExplorer, checkOutFile } from './commands/';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        new FtpExplorer(context);
    });
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkout', node => checkOutFile(node)));
}

export function deactivate() {}
