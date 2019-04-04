import * as vscode from 'vscode';
import * as fs from 'fs';
import * as ft from '../functions';
import * as name from './../constants';
import * as sftpClient from 'ssh2-sftp-client';



export function remoteListRootSFTP () {
    let remote = new sftpClient();
    let json = ft.readSettingsFile();
    
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