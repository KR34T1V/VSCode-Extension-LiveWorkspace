import * as vscode from 'vscode';
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";

export function viewFile (resource: vscode.Uri) {
    localGetSettingsJSON()
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpViewFile(resource);
    });
}