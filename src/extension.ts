import * as vscode from 'vscode';
import { FtpExplorer } from './commands/';
import { commandRefresh } from './commands';
import { FtpNode } from './workspace';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        new FtpExplorer(context);
        //commandFileExplorerRefresh();
    });
	context.subscriptions.push(disposable);
}

export function deactivate() {}
