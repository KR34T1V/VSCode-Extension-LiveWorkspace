import * as vscode from 'vscode';
import * as fs from 'fs';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        } from '../constants';

export function localCreateSettingsFolder ():boolean {
    var root = vscode.workspace.rootPath;
    
    VSCODE_OUTPUT.appendLine(`Creating Settings Folder! => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER}`);
    if (!existsSettingsFolder()){
        try {
            fs.mkdirSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER);
            VSCODE_OUTPUT.appendLine(`\tSuccess => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER} created!`);
            return(true);
        }
        catch(err) {
            VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
            return(false);
        }
    }
    else {
        VSCODE_OUTPUT.appendLine(`\tFailed => Folder already exists: ${EXTENSION_WORKSPACE_SETTINGS_FOLDER }`);
        return(false);
    }
}