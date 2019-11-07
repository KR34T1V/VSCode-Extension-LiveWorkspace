import * as vscode from 'vscode';
import * as fs from 'fs';
import { localExistSettingsFolder } from './localExistSettingsFolder';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        } from '../constants';
import mkdirp = require('mkdirp');

export function localCreateSettingsFolder (path:vscode.Uri): Thenable<boolean>{
    
    return new Promise((resolve)=>{

        VSCODE_OUTPUT.appendLine(`Creating Settings Folder! => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER}`);
        if (!localExistSettingsFolder(path)){
            try {
                mkdirp(path.fsPath+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER,(err)=>{
                    if (err){
                        throw(err);
                    }
                    VSCODE_OUTPUT.appendLine(`\tSuccess => ${EXTENSION_WORKSPACE_SETTINGS_FOLDER} created!`);
                    resolve(true);
                });
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