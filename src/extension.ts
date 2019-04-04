import * as vscode from 'vscode';
import * as sftp from './SFTP/SFTP_Functions';
import * as fs from 'fs';
import * as name from './constants';
import * as Client from 'ssh2-sftp-client';


export function remoteListRoot () {
    let remote = new Client();
    let json = sftp.readSettingsFile();
    remote.on('error', 
    (desc)=> {
        name.VSCODE_OUTPUT.appendLine(`SFTP => ${desc}`);
    });
    remote.connect({
        host: json.host,
        port: json.port,
        username: json.username,
        password: json.password,
        debug: console.log
    }).then(
        ()=>{
            return remote.list(json.remotePath);
    }).then(
        (data)=>{
            console.log(data);
    }).then(
        (err)=>{
            throw(err);
    });
}

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/
        sftp.initializeExtensionSettings();
        remoteListRoot();
    });
	context.subscriptions.push(disposable);
}
export function deactivate() {}
