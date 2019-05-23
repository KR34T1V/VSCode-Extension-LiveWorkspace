import * as ftpClient from 'ftp';
import { VSCODE_OUTPUT } from '../constants';
import { SettingsJSON } from '../interfaces';

export function ftpRemoteMkdir (path: string, settings: SettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((resolve)=>{
        
        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine('FTP:');
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function () {
            remote.mkdir(path, function (err) {
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Mkdir => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tMkdir Remote => (${path})`);
                }
                remote.end();
                resolve(1);
            });
        });

    });
}