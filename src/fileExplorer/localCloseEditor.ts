import * as vscode from 'vscode';

export function localCloseEditor (resource: vscode.Uri){
    var docs = vscode.workspace.textDocuments;
    if (docs) {
        docs.forEach((value, index)=>{
            var path= value.uri.path;
            if (path.includes(resource.path)){
                vscode.window.showTextDocument(value)
                .then(()=>vscode.commands.executeCommand('workbench.action.closeActiveEditor'));
            }
        });
    }
}