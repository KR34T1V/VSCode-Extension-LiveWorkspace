import * as vscode from 'vscode';
import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";
import { autoSaveFile } from "./commandSaveFile";
import { localDeleteFile } from "../fileExplorer/localDeleteFile";

export function checkInFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((settings)=>{
        autoSaveFile(node.resource, settings)
        .then(()=>closeLocalEditor(node.resource))
        .then(()=>{
            var stream = new FtpFileStream(settings);
            stream.ftpCheckIn(node);
        });
    });
}

function closeLocalEditor (resource: vscode.Uri){
    var root = vscode.workspace.rootPath;
    if (root){
        var uri = vscode.Uri.parse(`file:${root}${resource.path}`);
        vscode.window.showTextDocument(uri, {preview: false})
        .then(()=>vscode.commands.executeCommand('workbench.action.closeActiveEditor'));
    }
}