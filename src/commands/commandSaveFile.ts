import * as vscode from 'vscode';
import { FtpSettingsJSON } from '../interfaces';
import { VSCODE_OUTPUT } from '../constants';

export function autoSaveFile (uri: vscode.Uri ,settings: FtpSettingsJSON) {
    return new Promise((resolve)=>{
        if (settings.saveOnUpload === true){
            vscode.workspace.textDocuments.forEach((value, index)=>{
                let rootPath = vscode.workspace.rootPath;
                if (rootPath){
                    let remotePath = value.uri.fsPath.trim();
                    let localPath = rootPath.concat(uri.fsPath).trim();                    
                    if (localPath === remotePath) {                        
                        VSCODE_OUTPUT.appendLine(`\tSaving: ${localPath}`);
                        resolve(value.save());
                    }
                }
            });
        } else {
            resolve(0);
        }
    });
}