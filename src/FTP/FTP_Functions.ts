import * as name from '../constants';
import * as fs from 'fs';
import * as ftpClient from 'ftp';
import * as ft from './../functions';
import * as i from '../interfaces';
import { EEXIST } from 'constants';

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
            if (err) {
                throw err;
            }
            remote.end();
            return list;
        });
    });
}

export function remoteGetFTP (path: string, settings: i.FtpSettingsJSON){
    let remote = new ftpClient();
    
    remote.connect(settings);
    remote.on('ready', function () {
        remote.get(path, function (err, stream) {
            if (err){
                throw err;
            }
            stream.once('close', function () {
                remote.end();
            });
            stream.pipe(fs.createWriteStream(path));
        });
    });
}