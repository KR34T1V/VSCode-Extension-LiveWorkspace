import * as vscode from 'vscode';
import * as fs from 'fs';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';
import { SettingsJSON } from '../interfaces';
import { dirname } from 'path';

export function localGetSettingsJSON(): Thenable<SettingsJSON>{
    var root = vscode.workspace.rootPath;

    return new Promise((resolve)=>{

        VSCODE_OUTPUT.appendLine(`Loading Settings`);
        try{
            let result = fs.readFileSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE).toString();
            VSCODE_OUTPUT.appendLine(`Read Success!`);
            if (result !== undefined){
                let obj: SettingsJSON = JSON.parse(result.toString());
                obj.remotePath = cleanPath(obj.remotePath);
                resolve(obj);
            }
            else {
                throw(new Error('Error reading settings: undefined!'));
            }
        }
        catch(err){
            VSCODE_OUTPUT.appendLine(`Failed => ${err}`);
            throw (err);
        }
    });
}

function cleanPath (path: string): string {
    if (path === undefined){
        path = '/';
    } else {
        path = path.trim();
        if (!path.endsWith('/')) {
            path = path.concat('/');
        }
    }
    return path;
}