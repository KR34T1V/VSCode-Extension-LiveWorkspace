import * as vscode from 'vscode';
import { FtpNode } from '../interfaces';
import { localGetSettingsJSON } from './localGetSettingsJSON';
import { autoSaveFile } from '../commands/commandSaveFile';
import { FtpFileStream } from '../commands/classFtpFileStream';

export function localUploadOnSave(resource: vscode.Uri) {
    console.log(resource);
    
    var root = vscode.workspace.rootPath;
    if (root) {
        var path: vscode.Uri = vscode.Uri.parse(`ftp:${resource.path.replace(`/${root}`, '')}`);
        var node: FtpNode = {'resource': path, 'isDirectory': false};
        uploadFile(node);
    }
}

function uploadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpUpload(node);
    });
}