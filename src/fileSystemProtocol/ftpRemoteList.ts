import * as ftpClient from 'ftp';
import { VSCODE_OUTPUT } from '../constants';
import { FtpSettingsJSON } from '../interfaces';

export function ftpRemoteList (path: string, settings: FtpSettingsJSON): Thenable<object> {
    let remote = new ftpClient();

    return new Promise (function (resolve) {
        
        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            VSCODE_OUTPUT.appendLine('FTP: connected!');
    
            remote.list(path, function(err, list){
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError List=> ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tList Remote=> ${path}`);
                }
                remote.end();
                resolve(list);
            });
        });
    });
}