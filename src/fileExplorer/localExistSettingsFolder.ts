import * as vscode from 'vscode';
import * as fs from 'fs';
import { EXTENSION_WORKSPACE_SETTINGS_FOLDER } from '../constants';

export function localExistSettingsFolder (): boolean {
    var root = vscode.workspace.rootPath;
        if (fs.existsSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER)){
            return(true);
        }
        else {
            return(false);
        }
}