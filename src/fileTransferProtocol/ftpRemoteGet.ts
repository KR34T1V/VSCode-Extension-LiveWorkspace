import * as ftpClient from 'ftp';
import * as vscode from 'vscode';
import { VSCODE_OUTPUT } from '../constants';
import { SettingsJSON } from '../interfaces';
import * as fs from 'fs';

export function ftpRemoteGet (path: string, settings: SettingsJSON): Thenable<string> {
    let remote = new ftpClient();
    
    return new Promise ((resolve)=>{

        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            vscode.window.showWarningMessage(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function () {
            VSCODE_OUTPUT.appendLine('FTP:');
            remote.get(path, function (err, stream) {
                let string = '';
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Get => ${err}`);
                    vscode.window.showWarningMessage(`Error Get => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tGet Remote => (${path})`);
                    stream.setEncoding('utf8');
                    stream.on('data', function (buffer){
                        if (buffer) {
                            var part = buffer;
                            string += part;
                        }
                    });
                }
                stream.once('close', function () {
                    remote.end();
                    resolve(string.toString());
                });
            });
        });
    });
}
