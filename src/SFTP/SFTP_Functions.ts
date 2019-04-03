import * as vscode from 'vscode';
import * as fs from 'fs';
import * as name from './../constants';

/**Check Settings**/
export function existsSettings ():boolean{
    var root = vscode.workspace.rootPath;

    if (fs.existsSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+name.EXTENSION_SETTINGS_FILE)){
        return(true);
    }
    else {
        return(false);
    }
}

export function existsSettingsFolder ():boolean {
    var root = vscode.workspace.rootPath;

    if (fs.existsSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER)){
        return(true);
    }
    else {
        return(false);
    }
}
/**Create Settings End**/



/**Create Settings**/
export function createSettingsFolder ():boolean {
    var root = vscode.workspace.rootPath;
    
    name.VSCODE_OUTPUT.appendLine(`Creating Settings Folder! => ${name.EXTENSION_WORKSPACE_SETTINGS_FOLDER}`);
    if (!existsSettingsFolder()){
        try {
            fs.mkdirSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER);
            name.VSCODE_OUTPUT.appendLine(`\tSuccess => ${name.EXTENSION_WORKSPACE_SETTINGS_FOLDER} created!`);
            return(true);
        }
        catch(err) {
            name.VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
            return(false);
        }
    }
    else {
        name.VSCODE_OUTPUT.appendLine(`\tFailed => Folder already exists: ${name.EXTENSION_WORKSPACE_SETTINGS_FOLDER }`);
        return(false);
    }
}

export function createSettings ():boolean {
    var root = vscode.workspace.rootPath;

    name.VSCODE_OUTPUT.appendLine(`Creating Settings File! => ${name.EXTENSION_SETTINGS_FILE}`);
    if (!existsSettings()){
        try{
            fs.writeFileSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+name.EXTENSION_SETTINGS_FILE, name.DEFAULT_SETTINGS);
            name.VSCODE_OUTPUT.appendLine(`\tSuccess => ${name.EXTENSION_SETTINGS_FILE} created!`);
        return(true);
        }
        catch(err){
            name.VSCODE_OUTPUT.appendLine(`\tFailed! => ${err}`);
        return(false);
        }
    }
    else {
        name.VSCODE_OUTPUT.appendLine(`\tFailed => File already exists: ${name.EXTENSION_SETTINGS_FILE}`);
        return(false);
    }
}

export function initializeExtensionSettings () {
    if (!existsSettingsFolder()){
        createSettingsFolder();
    }
    if (!existsSettings()){
        createSettings();
    }
    else{
        name.VSCODE_OUTPUT.appendLine('Settings Exist!');
    }
}
/**Create Settings End**/



/**Read Settings**/
export function readSettingsFile():string|undefined{
    var root = vscode.workspace.rootPath;

    name.VSCODE_OUTPUT.appendLine(`Reading Settings File => ${name.EXTENSION_SETTINGS_FILE}`)
    try{
        let res = fs.readFileSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+name.EXTENSION_SETTINGS_FILE).toString();
        name.VSCODE_OUTPUT.appendLine(`Success => ${name.EXTENSION_SETTINGS_FILE} read`);
        if (res != undefined){
            return JSON.parse(res.toString());
        }
        else {
            return (undefined);
        }
    }
    catch(err){
        name.VSCODE_OUTPUT.appendLine(`Failed => ${err}`);
        return (undefined);
    }
}
/**Read Settings End**/