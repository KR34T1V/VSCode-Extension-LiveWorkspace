import * as vscode from 'vscode';
import { localGetSettingsJSON } from "../fileExplorer";
import { ftpGetSettingsJSON } from "../fileTransferProtocol";
import { FtpFileStream } from "./classFtpFileStream";

export function viewFile (resource: vscode.Uri) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpViewFile(resource);
    });
}