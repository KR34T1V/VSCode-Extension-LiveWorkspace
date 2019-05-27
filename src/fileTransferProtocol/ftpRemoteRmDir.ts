import * as ftpClient from 'ftp';
import * as vscode from 'vscode';
import { VSCODE_OUTPUT } from '../constants';
import { SettingsJSON } from '../interfaces';

export function ftpRemoteRmDir (path: string, settings: SettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((resolve)=>{

        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            vscode.window.showWarningMessage(`Oops, ${error}`);

            throw(error);
        });
        remote.on('ready', function(){
            VSCODE_OUTPUT.appendLine('FTP:');
            remote.rmdir(path, true, function (err) {
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Delete ${err}`);
                    vscode.window.showWarningMessage(`Error Delete ${err}`);

                    
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tRemote Deleted => (${path})`);
                }
                remote.end();
                resolve(1);
            });
        });

    });
}