import * as fs from 'fs';
import * as vscode from 'vscode';
import * as mkdirp from "mkdirp";
import { ftpRemoteGet, ftpRemoteList, ftpRemotePut } from '../fileSystemProtocol';
import { FtpSettingsJSON, FtpNode } from '../interfaces';
import { basename } from 'path';


export class FtpFileStream {
    constructor (private ftpSettings: FtpSettingsJSON){}

    public ftpTryCheckOut (node: any) {
        let resource = node.resource;
        let dirpath = resource.fsPath.match(/.*\\/)[0];
        //Check for LCK
        ftpRemoteList(`${dirpath}*.LCK`,this.ftpSettings)
        .then((result)=>{
            if (result){
                var data = Object.values(result);
                data.map((result)=>{
                    if (result.name === `${basename(resource.path)}.LCK`) {
                        ftpRemoteGet(`${resource.path}.LCK`, this.ftpSettings)
                        .then((dataString)=>{
                            let User = this.ftpSettings.user.trim();
                            let remoteUser = dataString.trim();
                            if (User === remoteUser){
                                this.ftpCheckOut(node);
                            }
                            else {
                                vscode.window.showWarningMessage(`Locked By: ${remoteUser.substr(0, 15)}`);
                            }
                        })
                    }
                })
                
            }
        });
    }
    
    private ftpCheckOut (node: any) {
        let resource = node.resource;
        //Create LCK
        this.ftpRemoteLock(`${resource.path}.lck`);
        //Check Date Stamp
        //On Success Download File To local
        let fullPath = `${vscode.workspace.rootPath}${resource.fsPath}`;
        let dirpath = resource.fsPath.match(/(.*)(?=\\)/)[0];
        let dir = `${vscode.workspace.rootPath}${dirpath}`;
        ftpRemoteGet(resource.path, this.ftpSettings)
        .then((dataString) => {
            mkdirp(dir, (err) => {
                if (err) {
                    console.error(err);
                }
                fs.writeFileSync(fullPath, dataString);
            });
        })
        .then(()=>{
            let path = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}${node.resource.path}`);
            vscode.window.showTextDocument(path);
        });
        //Open local text editor
    }

    private ftpRemoteLock (path: string) {
        console.log(path);
        
        ftpRemotePut(this.ftpSettings.user, path, this.ftpSettings);
    }
}