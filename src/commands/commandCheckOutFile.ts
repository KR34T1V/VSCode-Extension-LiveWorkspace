import { FtpFileStream } from './';
import * as vscode from 'vscode';
import { localGetSettingsJSON } from '../fileExplorer';
import { ftpGetSettingsJSON } from '../fileSystemProtocol';
import { FtpNode } from '../interfaces';

export function viewFile (resource: vscode.Uri) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpViewFile(resource);
    });
}

export function checkOutFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpCheckOut(node);
    });
}

export function checkInFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpCheckIn(node);
    });
}

export function uploadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpUpload(node);
    });
}

export function downloadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpDownload(node);
    });
}

export function renameFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpRename(node);
    });
}