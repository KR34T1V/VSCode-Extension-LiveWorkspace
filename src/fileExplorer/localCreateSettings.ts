import * as vscode from 'vscode';
import * as fs from 'fs';
import { localExistSettings } from './localExistSettings';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE,
        DEFAULT_SETTINGS
        } from '../constants';

export function localCreateSettings (): Thenable<boolean> {
    var root = vscode.workspace.rootPath;

    return new Promise((resolve)=>{

        VSCODE_OUTPUT.appendLine(`Creating Settings File! => ${EXTENSION_SETTINGS_FILE}`);
        if (!localExistSettings()){
            try{
                fs.writeFileSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE, DEFAULT_SETTINGS);
                VSCODE_OUTPUT.appendLine(`\tSuccess => ${EXTENSION_SETTINGS_FILE} created!`);
                resolve(true);
            }
            catch(err){
                VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
                throw(err);
            }
        }
        else {
            VSCODE_OUTPUT.appendLine(`\tFailed => File already exists: ${EXTENSION_SETTINGS_FILE}`);
            resolve(false);
        }
    });
}