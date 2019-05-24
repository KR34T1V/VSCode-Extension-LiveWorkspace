import * as mkdirp from 'mkdirp';
import { dirname } from 'path';
import { VSCODE_OUTPUT, EXTENSION_WORKSPACE_SETTINGS_FOLDER } from '../constants';

/*Create Preceding Directories In Path*/
export function localCreateDirectory(path: string) {
    return new Promise((resolve)=>{
        VSCODE_OUTPUT.appendLine(`Creating Directory: => ${path}`);
        let dir = dirname(path);
        mkdirp(dir, (err) => {
            if (err) {
                throw(err);
            } else {
                resolve(1);
            }
        });
    });
}