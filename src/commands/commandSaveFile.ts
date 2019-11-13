import * as vscode from 'vscode';
import { SettingsJSON } from '../interfaces';
import { VSCODE_OUTPUT } from '../constants';
import { logAction } from '../logging/logAction';

export function autoSaveFile (uri: vscode.Uri ,settings: SettingsJSON) {
    return new Promise((resolve)=>{
        if (settings.saveOnCheckIn === true){
            vscode.workspace.textDocuments.forEach((value, index)=>{
                let rootPath = vscode.workspace.rootPath;
                if (rootPath){
				logAction("rootPath", rootPath.concat(uri.fsPath).trim());                   
				logAction("fsPath", value.uri.fsPath.slice(1));
                    let remotePath = value.uri.fsPath.trim();
                    let localPath = rootPath.concat(uri.fsPath).trim();
                    if (localPath === remotePath) { 
                        value.save()
                        .then(()=>setTimeout(()=>resolve(),50));
                    }
                }
            });
        } else {
            resolve(0);
        }
    });
}