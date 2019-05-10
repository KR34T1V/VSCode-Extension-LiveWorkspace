import * as fs from 'fs';
import * as vscode from 'vscode';
import * as mkdirp from "mkdirp";
import { ftpRemoteGet, ftpRemoteList, ftpRemotePut, ftpRemoteDelete, ftpRemoteRename } from '../fileSystemProtocol';
import { FtpSettingsJSON, FtpNode } from '../interfaces';
import { basename, dirname } from 'path';


export class FtpFileStream {
    constructor (private ftpSettings: FtpSettingsJSON){}
    
    /*Open local file if you are the owner*/
    public ftpViewFile (resource: vscode.Uri) {
        let localPath = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}${resource.path}`);
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1){
                vscode.window.showTextDocument(localPath);
            } else {
                vscode.window.showTextDocument(resource);
            }
        });
    }

    /*Handle Checkout Command*/
    public ftpCheckOut (node: any) {
        let resource = node.resource;
        let uri = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}${resource.path}`);
        //Check LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1){
                //DOWNLOAD AND OPEN
                this.ftpDownloadFile(resource.path)
                .then(()=>vscode.window.showTextDocument(uri));
            } else if (result === 0) {
                //LOCK , DOWNLOAD AND OPEN
                this.ftpRemoteLock(resource.path)
                .then(()=>this.ftpDownloadFile(resource.path))
                .then(()=>vscode.window.showTextDocument(uri));
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`);
            }
        });
        //Check Date Stamp
    }
    
    /*Handle Checkin Command*/
    public ftpCheckIn (node: any) {
        let resource = node.resource;
        let localPath = `${vscode.workspace.rootPath}${resource.path}`;
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //UPLOAD, UNLOCK AND REVEAL
                ftpRemotePut(localPath,resource.path, this.ftpSettings)
                .then(()=>ftpRemoteDelete(`${resource.path}.LCK`, this.ftpSettings))
                .then(()=>vscode.window.showTextDocument(resource));
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Check-In!`);
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`);
            }
        });
    }

    /*Handle Upload Command*/
    public ftpUpload (node: any) {
        let resource = node.resource;
        let localPath = `${vscode.workspace.rootPath}${resource.path}`;
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //UPLOAD, UNLOCK AND REVEAL
                ftpRemotePut(localPath,resource.path, this.ftpSettings);
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Upload!`);
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`);
            }
        });
    }

    /*Handle Download Command*/
    public ftpDownload (node: any) {
        let resource = node.resource;
        let uri = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}${resource.path}`);
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //DOWNLOAD AND OPEN
                this.ftpDownloadFile(resource.path)
                .then(()=>vscode.window.showTextDocument(uri));
                //.then(()=>vscode.commands.executeCommand('workbench.action.files.revert')); //May Cause Issues (used to refresh document)
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Download!`);
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`);
            }
        });
    }

    /*Downloads the Remote File to Local*/
    private ftpDownloadFile (path: string) {
        return new Promise((resolve)=>{

            this.ftpCreateDirectory(path);
            ftpRemoteGet(path,this.ftpSettings)
            .then((dataString)=>{
                let localPath = `${vscode.workspace.rootPath}${path}`;
                fs.writeFileSync(localPath, dataString);
            });
            resolve(1);
        });
    }

    /*Check LCK file on the server*/
    private ftpRemoteCheckLock (path: string) {
        return new Promise(async (resolve)=>{
            
            path = `${path}.LCK`;
            let dir = dirname(path);
            let file = basename(path);
            ftpRemoteList(dir,this.ftpSettings)
            .then((result)=>{return (Object.values(result));})
            .then((result)=>{
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    if (element.name === file.trim()){
                        return(path);
                    }
                }
                return(undefined);
            })
            .then((result)=>{
                if (result === undefined){
                    resolve(0);
                } else {
                    ftpRemoteGet(result, this.ftpSettings)
                    .then((result)=>{
                        if (result.trim() === this.ftpSettings.user.trim()){
                            resolve(1);
                        } else {
                            resolve(result.trim());
                        }
                    });
                }
            });
        });
    }

    /*Create an LCK file on Server*/
    private ftpRemoteLock (path: string) {
        return new Promise((resolve)=>{

            path = `${path}.LCK`;
            ftpRemotePut(this.ftpSettings.user, path, this.ftpSettings);
            resolve(1);
        });
    }

    /*Create Preceding Directories In Path*/
    private ftpCreateDirectory(path: string) {

        return new Promise((resolve)=>{
            let dir = dirname(path);
            mkdirp(dir, (err) => {
                if (err) {
                    throw(err);
                } else {
                    resolve(1);
                }
            });
        });
    }

    /*Rename Remote File/Folder*/
    public ftpRename (node: any) {
        let resource = node.resource;
        let dir = dirname(resource.path);
        vscode.window.showInputBox()
        .then((value)=>{
            if (value !== undefined && value.length){
                ftpRemoteRename(resource.path, `${dir}/${value}`, this.ftpSettings);
            }
        });
    }

    /*Delete Remote File/Folder*/
    public ftpDelete (node: any) {
        let resource = node.resource;
        let dir = dirname(resource.path);
        let name = basename(resource.path);
        vscode.window.showWarningMessage(`Delete ${name}`, `Away With It!`, `Oh Sh*t, Still Need That`)
        .then((result)=>{
            if (result === `Away With It!`){
                ftpRemoteDelete(resource.path, this.ftpSettings);
            }
        });
    }
}