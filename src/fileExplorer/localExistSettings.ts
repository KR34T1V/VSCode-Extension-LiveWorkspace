import * as vscode from 'vscode';
import * as fs from 'fs';
import {EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';

export function localExistSettings (): boolean {
    var root = vscode.workspace.rootPath;
    if (fs.existsSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE)){
        return(true);
    }
    else{
        return(false);
    }
}