import * as vscode from 'vscode';
import * as fs from 'fs';
import { EXTENSION_WORKSPACE_SETTINGS_FOLDER } from '../constants';

export function localExistSettingsFolder (path:vscode.Uri): boolean {
        if (fs.existsSync(path.fsPath+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER)){
            return(true);
        }
        else {
            return(false);
        }
}