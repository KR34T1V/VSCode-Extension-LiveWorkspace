import * as vscode from 'vscode';
import * as ftp from './FTP_Functions';
import * as ft from './functions';
import { SettingsJSON,  FTPListingObjectItem } from './interfaces';

export async function commandRefresh () {
    var settingsJSON: SettingsJSON = ft.readSettingsFile();
    var path = settingsJSON.remotePath;
    //if sftp
    //FTP
    var settingsFTP = await ftp.extractFTPSettings(settingsJSON);
    console.log(`Path: ${path}`);
    ftp.remoteListFTP(path, settingsFTP)
    .then(function (res: object){
        var Arr = Object.values(res);
        Arr.forEach(function(elem: FTPListingObjectItem) {
            console.log(elem);
        });
    });
    
}