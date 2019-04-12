import * as ftpClient from 'ftp';
import { VSCODE_OUTPUT } from '../constants';
import { FtpSettingsJSON } from '../interfaces';

export function ftpRemoteRename (src: string, dest: string, settings: FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((resolve)=>{
        
        remote.connect(settings);
        remote.on('error',function(error) {
            VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.rename(src, dest, function (err) {
                if (err){
                    VSCODE_OUTPUT.appendLine(`\tError Rename => ${err}`);
                    throw(err);
                }
                else {
                    VSCODE_OUTPUT.appendLine(`\tRenamed => (${src} -> ${dest})`);
                }
            });
        });

    });
}