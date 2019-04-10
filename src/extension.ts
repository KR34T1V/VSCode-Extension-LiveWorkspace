import * as vscode from 'vscode';
import * as ft from './functions';
import * as name from './constants';
import * as fs from 'fs';
import * as ftp from './FTP_Functions';
import * as i from './interfaces';
import * as workspace from './workspace'; 
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
