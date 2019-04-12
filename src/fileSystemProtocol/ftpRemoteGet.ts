import * as ftpClient from 'ftp';
import { VSCODE_OUTPUT } from '../constants';
import { FtpSettingsJSON } from '../interfaces';
import * as fs from 'fs';

export function ftpRemoteGet (path: string, settings: FtpSettingsJSON) {
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
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Get => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tGet (Remote->Local) => ${path}`);
                }
                stream.once('close', function () {
                    remote.end();
                });
                stream.pipe(fs.createWriteStream(path));
            });
        });
    });
}