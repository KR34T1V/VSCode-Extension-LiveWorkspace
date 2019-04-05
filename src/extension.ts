import * as vscode from 'vscode';
import * as ft from './functions';
import * as name from './constants';
import * as fs from 'fs';
import * as ftp from './FTP/FTP_Functions';
import * as i from './interfaces';
import { OutgoingMessage } from 'http';

export function manageProtocol(settings: i.SettingsJSON){
    if (settings.protocol === "sftp"){
        //CALL SFTP PATH 
    }
    else {
        //CALL FTP PATH
    }
}

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        let pie1 = ft.readSettingsFile();
        let pie2 = ftp.extractFTPSettings(pie1);
    });
	context.subscriptions.push(disposable);
}
export function deactivate() {}
