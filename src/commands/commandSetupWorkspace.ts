import * as vscode from 'vscode';
import { localExistSettingsFolder, localCreateSettingsFolder, localCreateSettings } from '../fileExplorer';
import { EXTENSION_NAME } from '../constants';

export function setupWorkspace() {
    var path = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}/.vscode/${EXTENSION_NAME}.json`);
    if (!localExistSettingsFolder()) {
        console.log('here');
        
        localCreateSettingsFolder()
            .then(() => localCreateSettings())
            .then(()=>{
                // vscode.workspace.openTextDocument(path)
                // .then((value)=>vscode.window.showTextDocument(value));
        });
    }
    else {
        console.log('not here');

        localCreateSettings()
        .then(()=>{
            // vscode.workspace.openTextDocument(path)
            // .then((value)=>vscode.window.showTextDocument(value));
    });
    }
}