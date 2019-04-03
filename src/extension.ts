import * as vscode from 'vscode';
import * as fs from 'fs';
import * as name from './constants';

function existsSettings ():boolean{
    var root = vscode.workspace.rootPath;

    if (fs.existsSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+name.EXTENSION_SETTINGS_FILE)){
        return(true);
    }
    else {
        return(false);
    }
}

function existsSettingsFolder ():boolean {
    var root = vscode.workspace.rootPath;

    if (fs.existsSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER)){
        return(true);
    }
    else {
        return(false);
    }
}

function createSettingsFolder ():boolean {
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

function createSettings ():boolean {
    var root = vscode.workspace.rootPath;

    name.VSCODE_OUTPUT.appendLine(`Creating Settings File! => ${name.EXTENSION_SETTINGS_FILE}`)
    if (!existsSettings()){
        try{
            fs.writeFileSync(root+'/'+name.EXTENSION_WORKSPACE_SETTINGS_FOLDER+'/'+name.EXTENSION_SETTINGS_FILE, name.DEFAULT_SETTINGS);
            name.VSCODE_OUTPUT.appendLine(`\tSuccess => ${name.EXTENSION_SETTINGS_FILE} created!`)
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


export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        /*Create Folder*/

        if (createSettingsFolder()){
            createSettings();
        }
    });
	context.subscriptions.push(disposable);
}
export function deactivate() {}
