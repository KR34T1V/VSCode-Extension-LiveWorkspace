import * as name from '../constants';
import * as fs from 'fs';
import * as ftpClient from 'ftp';
import * as ft from './../functions';
import * as i from '../interfaces';

export function extractFTPSettings (json: i.SettingsJSON) {
    let ftpSettings = {
        "host": json.host,
        "port": json.port,
        "user": json.username,
        "password": json.password,
        "connTimeout": json.connTimeout,
        "pasvTimeout": json.passvTimout,
        "keepalive": json.keepalive
    };

    return ftpSettings;
}

export function remoteListFTP (path: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();

    remote.connect(settings);
    remote.on('error',function(error) {
        name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
    });
    remote.on('ready', function(){
        name.VSCODE_OUTPUT.appendLine('FTP: connected!');
        remote.list(path, function(err, list){
            if (err){
                name.VSCODE_OUTPUT.appendLine(`FTP-List ${err}`);
            }
            else {
                name.VSCODE_OUTPUT.appendLine(`Ftp-List: ${path}`);
            }
            remote.end();
            return list;
        });
    });
}

export function remoteGetFTP (path: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    remote.connect(settings);
    remote.on('error',function(error) {
        name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
    });
    remote.on('ready', function () {
        remote.get(path, function (err, stream) {
            if (err){
                name.VSCODE_OUTPUT.appendLine(`FTP-Get ${err}`);
            }
            else {
                name.VSCODE_OUTPUT.appendLine(`FTP-Remote=>Local: ${path}`);
            }
            stream.once('close', function () {
                remote.end();
            });
            stream.pipe(fs.createWriteStream(path));
        });
    });
}

export function remotePutFTP (src: string, dest: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    remote.connect(settings);
    remote.on('error',function(error) {
        name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
    });
    remote.on('ready', function () {
        remote.put(src, dest, function (err) {
            if (err){
                name.VSCODE_OUTPUT.appendLine(`FTP-Put ${err}`);
            }
            else {
                name.VSCODE_OUTPUT.appendLine(`FTP-Local=>Remote: ${src}`);
            }
            remote.end();
        });
    });
}

export function remoteRenameFTP (src: string, dest: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    remote.connect(settings);
    remote.on('error',function(error) {
        name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
    });
    remote.rename(src, dest, function (err) {
        if (err){
            name.VSCODE_OUTPUT.appendLine(`FTP-Rename ${err}`);
        }
        else {
            name.VSCODE_OUTPUT.appendLine(`FTP-Rename ${src} => ${dest}`);
        }
    });
}