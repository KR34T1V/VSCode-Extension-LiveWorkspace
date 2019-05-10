import * as vscode from 'vscode';
import { FtpExplorer, checkOutFile, checkInFile, uploadFile, viewFile, downloadFile } from './commands/';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        new FtpExplorer(context);
    });
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkout', node => checkOutFile(node)));
	context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkin', node => checkInFile(node)));
    context.subscriptions.push(vscode.commands.registerCommand('live-workspace.upload', node => uploadFile(node)));
    context.subscriptions.push(vscode.commands.registerCommand('live-workspace.download', node => downloadFile(node)));
    vscode.commands.registerCommand('live-workspace.openFtpResource', resource => viewFile(resource));
    
}

export function deactivate() {}
