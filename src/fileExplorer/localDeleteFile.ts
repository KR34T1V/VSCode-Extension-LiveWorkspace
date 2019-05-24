import * as fs from 'fs';
import { SettingsJSON } from '../interfaces';

export function localDeleteFile (path: string, settings: SettingsJSON) {
    if (settings.clearCacheOnCheckIn){
        fs.unlinkSync(path);
    }
}