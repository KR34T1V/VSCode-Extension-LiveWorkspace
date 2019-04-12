import * as vscode from 'vscode';
import * as fs from 'fs';
import {EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';

export function localExistSettings (): Thenable<boolean> {
    var root = vscode.workspace.rootPath;

    return new Promise((resolve)=>{

        if (fs.existsSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE)){
            resolve(true);
        }
        else{
            resolve(false);
        }
    });
}