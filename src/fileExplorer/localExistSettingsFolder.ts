import * as vscode from 'vscode';
import * as fs from 'fs';
import { EXTENSION_WORKSPACE_SETTINGS_FOLDER } from '../constants';

export function localExistSettingsFolder (): Thenable<boolean> {
    var root = vscode.workspace.rootPath;

    return new Promise((resolve)=> {

        if (fs.existsSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER)){
            resolve(true);
        }
        else {
            resolve(false);
        }
    });
}