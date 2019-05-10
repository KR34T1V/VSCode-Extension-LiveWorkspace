import * as ftpClient from 'ftp';
import { VSCODE_OUTPUT } from '../constants';
import { FtpSettingsJSON } from '../interfaces';
import * as fs from 'fs';

export function ftpRemoteGet (path: string, settings: FtpSettingsJSON): Thenable<string> {
    let remote = new ftpClient();
    
    return new Promise ((resolve)=>{

        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function () {
            VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.get(path, function (err, stream) {
                let string = '';
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Get => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tGet Remote => (${path})`);
                    stream.on('data', function (buffer){
                        if (buffer) {
                            var part = buffer.toString();
                            string += part;
                        }
                    });
                }
                stream.once('close', function () {
                    remote.end();
                    resolve(string);
                });
            });
        });
    });
}