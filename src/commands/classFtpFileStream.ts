import * as fs from 'fs';
import * as vscode from 'vscode';
import * as mkdirp from "mkdirp";
import { ftpRemoteGet, ftpRemoteList, ftpRemotePut } from '../fileSystemProtocol';
import { FtpSettingsJSON, FtpNode } from '../interfaces';
import { basename, dirname } from 'path';


export class FtpFileStream {
    constructor (private ftpSettings: FtpSettingsJSON){}
    
    public ftpCheckOut (node: any) {
        let resource = node.resource;
        //Check LCK
        this.ftpRemoteCheckLock(resource.path)
        .then(test => console.log(test));
        //Create LCK
        //Check Date Stamp
        //On Success Download File To local
        //Open local text editor
        let path = vscode.Uri.parse(`file:///${vscode.workspace.rootPath}${node.resource.path}`);
        //vscode.window.showTextDocument(path);
    }
    
    /*Downloads the Remote File to Local*/
    private ftpDownloadFile (path: string) {
        this.ftpCreateDirectory(path);
        ftpRemoteGet(path,this.ftpSettings)
        .then((dataString)=>{
            let localPath = `${vscode.workspace.rootPath}${path}`;
            fs.writeFileSync(localPath, dataString);
        });
    }
    /*Check if LCK file is present on the server*/
    private ftpRemoteCheckLock (path: string) {

        return new Promise((resolve)=>{
            path = `${path}.LCK`;
            let dir = dirname(path);
            let file = basename(path);
            ftpRemoteList(dir, this.ftpSettings)
            .then((result)=>{
                let found;
                let data = Object.values(result);
                data.map((element)=>{
                    if (element.name === file) {
                        found = 1;
                        ftpRemoteGet(path,this.ftpSettings)
                        .then((dataString)=>{
                            let Remote = dataString.trim();
                            let Local = this.ftpSettings.user;
                            if (Remote === Local){
                                resolve(1);
                            } else {
                                console.log(Remote, Local);
                                
                                resolve (-1);
                            }
                            
                        });
                    }
                    console.log('in');
                });
                console.log('Out');
                resolve(0);
                
            });
        });
    }

    /*Create an LCK file on Server*/
    private ftpRemoteLock (path: string) {
        path = `${path}.LCK`;
        console.log(path);
        
        ftpRemotePut(this.ftpSettings.user, path, this.ftpSettings);
    }

    /*Create Preceding Directories In Path*/
    private ftpCreateDirectory(path: string) {

        return new Promise((resolve)=>{
            let dir = dirname(path);
            console.log(dir);
            
            mkdirp(dir, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Directory ${dir} Created!`);
                    resolve(1);
                }
            });
        });
    }


}