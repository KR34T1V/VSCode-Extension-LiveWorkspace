import * as vscode from 'vscode';
import * as fs from 'fs';
import { localExistSettingsFolder } from './localExistSettingsFolder';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        } from '../constants';

export function localCreateSettingsFolder (): Thenable<boolean>{
    var root = vscode.workspace.rootPath;
    
    return new Promise((resolve)=>{

        VSCODE_OUTPUT.appendLine(`Creating Settings Folder! => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER}`);
        if (!localExistSettingsFolder()){
            try {
                fs.mkdirSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER);
                VSCODE_OUTPUT.appendLine(`\tSuccess => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER} created!`);
                resolve(true);
            }
            catch(err) {
                VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
                throw(err);
            }
        }
        else {
            VSCODE_OUTPUT.appendLine(`\tFailed => Folder already exists: ${EXTENSION_WORKSPACE_SETTINGS_FOLDER }`);
            resolve(false);
        }
    });
}