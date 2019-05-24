import * as vscode from 'vscode';

export function localCloseEditor (path: string){
    var uri: vscode.Uri = vscode.Uri.parse(`file:${path}`);
    vscode.window.showTextDocument(uri, {preview: false})
    .then(()=>vscode.commands.executeCommand('workbench.action.closeActiveEditor'));
}