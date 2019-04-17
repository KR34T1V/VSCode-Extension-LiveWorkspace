import * as vscode from 'vscode';
import { FtpTreeDataProvider, FtpExplorer, commandFileExplorerRefresh } from './commands/';
import { commandRefresh } from './commands';
import { FtpNode } from './workspace';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        new FtpExplorer(context);
        commandFileExplorerRefresh()
        .then((res)=>console.log(res));
    });
	context.subscriptions.push(disposable);
}

export function deactivate() {}
