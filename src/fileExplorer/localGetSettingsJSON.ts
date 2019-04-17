import * as vscode from 'vscode';
import * as fs from 'fs';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';
import { SettingsJSON } from '../interfaces';

export function localGetSettingsJSON(): Thenable<SettingsJSON>{
    var root = vscode.workspace.rootPath;

    return new Promise((resolve)=>{

        VSCODE_OUTPUT.appendLine(`Loading Settings`);
        try{
            let result = fs.readFileSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE).toString();
            VSCODE_OUTPUT.appendLine(`Read Success!`);
            if (result !== undefined){
                resolve(JSON.parse(result.toString()));
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