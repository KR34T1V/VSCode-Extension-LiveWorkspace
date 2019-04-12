import * as vscode from 'vscode';
import * as fs from 'fs';
import { VSCODE_OUTPUT,
        EXTENSION_WORKSPACE_SETTINGS_FOLDER,
        EXTENSION_SETTINGS_FILE 
        } from '../constants';

export function localGetSettingsJSON():any{
    var root = vscode.workspace.rootPath;

    VSCODE_OUTPUT.appendLine(`Loading Settings`);
    try{
        let res = fs.readFileSync(root+'/'+EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+EXTENSION_SETTINGS_FILE).toString();
        VSCODE_OUTPUT.appendLine(`Read Success!`);
        if (res !== undefined){
            return JSON.parse(res.toString());
        }
        else {
            throw(new Error('Error reading settings: undefined!'));
        }
    }
    catch(err){
        VSCODE_OUTPUT.appendLine(`Failed => ${err}`);
        throw (err);
    }
}