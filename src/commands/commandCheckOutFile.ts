import { FtpFileStream } from './';
import * as vscode from 'vscode';
import { localGetSettingsJSON } from '../fileExplorer';
import { ftpGetSettingsJSON } from '../fileSystemProtocol';
import { FtpNode } from '../interfaces';

export function checkOutFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpCheckOut(node);
    })
    .then(()=>{

    });
}