import * as vscode from 'vscode';
import * as fs from 'fs';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';

export function localCreateSettings ():boolean {
    var root = vscode.workspace.rootPath;

    VSCODE_OUTPUT.appendLine(`Creating Settings File! => ${EXTENSION_SETTINGS_FILE}`);
    if (!existsSettings()){
        try{
            fs.writeFileSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE, DEFAULT_SETTINGS);
            VSCODE_OUTPUT.appendLine(`\tSuccess => ${EXTENSION_SETTINGS_FILE} created!`);
        return(true);
        }
        catch(err){
            VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
        return(false);
        }
    }
    else {
        VSCODE_OUTPUT.appendLine(`\tFailed => File already exists: ${EXTENSION_SETTINGS_FILE}`);
        return(false);
    }
}