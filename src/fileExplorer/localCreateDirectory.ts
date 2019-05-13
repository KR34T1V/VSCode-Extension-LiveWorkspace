import * as mkdirp from 'mkdirp';
import { dirname } from 'path';

/*Create Preceding Directories In Path*/
export function localCreateDirectory(path: string) {

    return new Promise((resolve)=>{
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