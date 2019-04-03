import * as vscode from 'vscode';
import * as sftp from './SFTP/SFTP_Functions';
import * as fs from 'fs';
import * as name from './constants';


export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        sftp.initializeExtensionSettings();
        console.log(sftp.readSettingsFile());
    });
	context.subscriptions.push(disposable);
}
export function deactivate() {}
