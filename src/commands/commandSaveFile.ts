import * as vscode from 'vscode';
import { FtpSettingsJSON } from '../interfaces';

export function saveFiles (settings: FtpSettingsJSON) {
    return new Promise((resolve)=>{
        if (settings.saveOnUpload === true){
            resolve(vscode.workspace.saveAll(false));
        } else {
            resolve(0);
        }
    });
}