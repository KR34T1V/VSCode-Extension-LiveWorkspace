import * as ftpClient from 'ftp';
import * as vscode from 'vscode';
import { VSCODE_OUTPUT } from '../constants';
import { SettingsJSON } from '../interfaces';

export function ftpRemoteAbort (settings: SettingsJSON) {
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
            remote.abort(function (err) {
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Abort => ${err}`);
                    vscode.window.showWarningMessage(`Error Abort => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tAborted All Transfers!`);
                }
                remote.end();
                resolve(1);
            });
        });

    });
}