import * as fs from 'fs';
import * as vscode from 'vscode';
import { ftpRemoteGet, ftpRemoteList, ftpRemotePut, ftpRemoteDelete, ftpRemoteRename, ftpRemoteMkdir } from '../fileTransferProtocol';
import { SettingsJSON, FtpNode } from '../interfaces';
import { basename, dirname } from 'path';
import { ftpRemoteRmDir } from '../fileTransferProtocol/ftpRemoteRmDir';
import { localCreateDirectory, localExistFile, localCloseEditor } from '../fileExplorer';
import { refreshTree } from './commandRefreshTree';
import { EXTENSION_NAME } from '../constants';
import { downloadFile } from './commandDownloadFile';
import { localDeleteFile } from '../fileExplorer/localDeleteFile';
import { logAction } from '../logging/logAction';
import { logError } from '../logging/logError';


export class FtpFileStream {
    constructor (private ftpSettings: SettingsJSON){}
    
    /*Open local file if you are the owner*/
    public ftpViewFile (resource: vscode.Uri) {
        let localPath = vscode.Uri.parse(`file:/${vscode.workspace.rootPath}${resource.path}`);
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1 && localExistFile(resource.path)){
                vscode.window.showTextDocument(localPath, {preview: false});
            } else if(result === 1){
                downloadFile({"resource":resource, "isDirectory": false});
            } else {
                vscode.window.showTextDocument(resource, {preview: true});
            }
        });
    }

    /*Handle Checkout Command*/
    public ftpCheckOut (node: any) {
        let resource = node.resource;
        let uri = vscode.Uri.parse(`file:/${vscode.workspace.rootPath}${resource.path}`);
		logAction("CheckOut", `${resource.path}`);
        //Check LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1){
                //DOWNLOAD AND OPEN
                this.ftpDownloadFile(resource)
                .then(()=>vscode.window.showTextDocument(uri))
				.then(()=>logAction("CheckOut", `Already Checked Out ${resource.path}`));
            } else if (result === 0) {
                //LOCK , DOWNLOAD AND OPEN
                this.ftpRemoteLock(resource.path)
                .then(()=>this.ftpDownloadFile(resource))
                .then(()=>vscode.window.showTextDocument(uri))
                .then(()=>refreshTree())
				.then(()=>logAction("CheckOut", `Successfully Checked Out ${resource.path}`));
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`)
				.then(()=>logError("CheckOut", `Locked By: ${result}`));
            }
        });
        //Check Date Stamp
    }
    
    /*Handle Checkin Command*/
    public ftpCheckIn (node: any) {
        let resource = node.resource;
        let localPath = `${vscode.workspace.rootPath}${resource.path}`;
		logAction("CheckIn", `${localPath}`);
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //UPLOAD, UNLOCK AND REVEAL
                ftpRemotePut(localPath,resource.path, this.ftpSettings)
                .then(()=>ftpRemoteDelete(`${resource.path}.LCK`, this.ftpSettings))
                //.then(()=>localCloseEditor(resource))
                .then(()=>localDeleteFile(localPath, this.ftpSettings))
                //.then(()=>vscode.commands.executeCommand('workbench.action.files.revert')) //May Cause Issues (used to refresh document)
                .then(()=>vscode.window.showTextDocument(resource))
                .then(()=>refreshTree())
				.then(()=>logAction("CheckIn", `Successfully Checked In.`));
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Check-In!`)
				.then(()=>logError("CheckIn", `Checkout file before you Check-In!`));
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`)
				.then(()=>logError("CheckIn", `Locked By: ${result}`));
            }
        });
    }

    /*Handle Upload Command*/
    public ftpUpload (node: any) {
        let resource = node.resource;
        let localPath = `${vscode.workspace.rootPath}${resource.path}`;
		logAction("Upload", `${localPath}`);
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //UPLOAD, UNLOCK AND REVEAL
				logAction("Upload", `${resource.path}`);
                ftpRemotePut(localPath,resource.path, this.ftpSettings)
				.then(()=>logAction("Upload", `Successfully Uploaded.`));
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Upload!`)
				.then(()=>logError("Upload", `Checkout file before you Upload!`));
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`)
				.then(()=>logError("Upload", `Locked By: ${result}`));
            }
        });
    }

    /*Handle Download Command*/
    public ftpDownload (node: any) {
        let resource = node.resource;
        let uri = vscode.Uri.parse(`file:/${vscode.workspace.rootPath}${resource.path}`);
		logAction("Download", `${resource.path}`);
        //CHECK LCK
        this.ftpRemoteCheckLock(resource.path)
        .then((result)=>{
            if (result === 1) {
                //DOWNLOAD AND OPEN
                this.ftpDownloadFile(resource)
                .then(()=>vscode.window.showTextDocument(uri))
				.then(()=>logAction("Download", `Successfully Downloaded.`));
                //.then(()=>vscode.commands.executeCommand('workbench.action.files.revert')); //May Cause Issues (used to refresh document)
            } else if (result === 0) {
                vscode.window.showWarningMessage(`Checkout file before you Download!`)
				.then(()=>logError("Download", `Checkout file before you Download!`));
                //STOP ACCESS
            } else {
                //REPORT OWNER
                vscode.window.showWarningMessage(`Locked By: ${result}`)
				.then(()=>logError("Download", `Locked By: ${result}`));
            }
        });
    }

    /*Downloads the Remote File to Local*/
    private ftpDownloadFile (resource: vscode.Uri) {
        return new Promise((resolve)=>{

            localCreateDirectory(`${vscode.workspace.rootPath}${resource.fsPath}`)
            .then(()=>ftpRemoteGet(resource.path,this.ftpSettings))
            .then((dataString)=>{
                let localPath = `${vscode.workspace.rootPath}${resource.path}`;
                fs.writeFileSync(localPath, dataString);
                resolve(1);
            });
        });
    }

    /*Check if a username has been set*/
    private checkUsername () {
        return new Promise((resolve)=>{
            let username = vscode.workspace.getConfiguration(EXTENSION_NAME).get('username');
            if (!username) {
                vscode.window.showInputBox({placeHolder: 'Username', prompt: `Please Set a Username to use with Live-Workspace. `})
                .then((value)=>{
                    if (value !== undefined){
                        vscode.workspace.getConfiguration(EXTENSION_NAME).update('username', value.trim(), true)
                        .then(()=>resolve(value));
                    }
                    else {
                        vscode.window.showErrorMessage('Username Not Set!')
						.then(()=>logError("CheckUsername", `Username Not Set!`));
                    }
                });
            }
            else {
                resolve(username);
            }
        });
    }

    /*Check LCK file on the server*/
    private ftpRemoteCheckLock (path: string) {
        return new Promise(async (resolve)=>{
            path = `${path}.LCK`;
            let dir = dirname(path);
            let file = basename(path);
            this.checkUsername()
            .then(()=>ftpRemoteList(dir,this.ftpSettings))
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
            .then(async (result)=>{
                let username:string | undefined = await vscode.workspace.getConfiguration(EXTENSION_NAME).get('username');
                
                if (result === undefined){
                    resolve(0);
                } else {
                    ftpRemoteGet(result, this.ftpSettings)
                    .then((result)=>{
                        if (result.trim() === username) {
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
        return new Promise(async (resolve)=>{
            let username: string | undefined = await vscode.workspace.getConfiguration(EXTENSION_NAME).get('username');

            path = `${path}.LCK`;
            if (username){
                ftpRemotePut(username, path, this.ftpSettings)
                .then(()=>{
					resolve(1);
					});
            }
        });
    }


    /*Rename Remote File/Folder*/
    public ftpRename (node: FtpNode) {
        let resource = node.resource;
        let dir = dirname(resource.path);
        vscode.window.showInputBox()
        .then((value)=>{
            if (value !== undefined && value.length){
				logAction("ftpRename", `${resource.path}->${dir}/${value}`);
                ftpRemoteRename(resource.path, `${dir}/${value}`, this.ftpSettings)
                .then(()=>{
					logAction("ftpRename", `Renamed ${resource.path} -> ${dir}/${value}`);
					refreshTree();
					});
            }
        });
    }

    /*Delete Remote File/Folder*/
    public ftpDelete (node: FtpNode) {
        let resource = node.resource;
        let name = basename(resource.path);
        vscode.window.showWarningMessage(`Delete ${name}`, `Away With It!`, `Oh Sh*t, Still Need That`)
        .then((result)=>{
            if (node.isDirectory){
                if (result === `Away With It!`){
                    ftpRemoteRmDir(resource.path, this.ftpSettings)
                    .then(()=>refreshTree())
					.then(()=>logAction("Delete", `Directory Deleted ${resource.fsPath}`));
                }
            } else {
                if (result === `Away With It!`){
                    ftpRemoteDelete(resource.path, this.ftpSettings)
                    .then(()=>refreshTree())
					.then(()=>logAction("Delete", `File Deleted ${resource.fsPath}`));
                }
            }
        });
    }

    /*Create New Remote Folder*/
    public ftpNewFolder (node: any) {
        if (node === undefined){
            vscode.window.showInputBox()
            .then((result)=>{
                if (result !== undefined && result.length){  
                    ftpRemoteMkdir(`${this.ftpSettings.remotePath}${result}`, this.ftpSettings)
                    .then(()=>refreshTree())
					.then(()=>logAction("NewFolder", `Folder Created ${result}`));
                }
            });
        } else {
            let resource = node.resource;
            let path = resource.path;
            let dir = dirname(resource.path);
            vscode.window.showInputBox()
            .then((result)=>{
                if (node.isDirectory){
                    if (result !== undefined && result.length){  
                        ftpRemoteMkdir(`${path}/${result}`, this.ftpSettings)
                        .then(()=>refreshTree())
						.then(()=>logAction("NewFolder", `Folder Created ${result}`));
                    }
                } else {
                    if (result !== undefined && result.length){
                        ftpRemoteMkdir(`${dir}/${result}`, this.ftpSettings)
                        .then(()=>refreshTree())
						.then(()=>logAction("NewFolder", `Folder Created ${result}`));
                    }
                }
            });
        }
    }

    /*Create New Remote File*/
    public async ftpNewFile (node: any) {
        var username: string | undefined = await vscode.workspace.getConfiguration(EXTENSION_NAME).get('username');
        if (node === undefined){
            vscode.window.showInputBox()
            .then((result)=>{
                if (result !== undefined && result.length){
                    ftpRemotePut(`File Created by ${username}`, `${this.ftpSettings.remotePath}${result}`, this.ftpSettings)
                    .then(()=>refreshTree())
					.then(()=>logAction("NewFile", `File Created ${result}`));
                }
            });
        } else if (node && node.resource && node.resource.path){

            let resource = node.resource;
            let path = resource.path;
            let dir = dirname(resource.path);
            vscode.window.showInputBox()
            .then((result)=>{
                if (node.isDirectory){
                    if (result !== undefined && result.length){
                        ftpRemotePut(`File Created by ${username}`, `${path}/${result}`, this.ftpSettings)
                        .then(()=>refreshTree())
						.then(()=>logAction("NewFile", `File Created ${result}`));
                    }
                } else {
                    if (result !== undefined && result.length){
                        ftpRemotePut(`File Created by ${username}`, `${dir}/${result}`, this.ftpSettings)
                        .then(()=>refreshTree())
						.then(()=>logAction("NewFile", `File Created ${result}`));
                    }
                }
            });
        }
    }

}