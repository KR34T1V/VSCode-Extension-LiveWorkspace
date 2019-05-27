import * as ftpClient from 'ftp';
import * as vscode from 'vscode';
import { VSCODE_OUTPUT } from '../constants';
import { SettingsJSON } from '../interfaces';

export function ftpRemoteList (path: string, settings: SettingsJSON): Thenable<object> {
    let remote = new ftpClient();
    return new Promise (function (resolve) {
        
        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            vscode.window.showWarningMessage(`Oops, ${error}`);
            resolve(undefined);
            throw(error);
        });
        remote.on('ready', function(){
            VSCODE_OUTPUT.appendLine('FTP:');
    
            remote.list(path, function(err, list){
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError List => ${err}`);
                    vscode.window.showWarningMessage(`Error List => ${err}`);
                    resolve(undefined);                    
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tList Remote => (${path})`);
                }
                remote.end();
                resolve(list);
            });
        });
    });
}