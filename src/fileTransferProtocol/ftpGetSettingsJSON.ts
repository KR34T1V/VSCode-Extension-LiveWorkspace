import { SettingsJSON, FtpSettingsJSON } from '../interfaces';
export function ftpGetSettingsJSON (json: SettingsJSON):Thenable<FtpSettingsJSON> {
    
    return new Promise((resolve)=>{

        let ftpSettings = {
            "host": json.host,
            "port": json.port,
            "user": json.username,
            "remotePath": json.remotePath,
            "password": json.password,
            "connTimeout": json.connTimeout,
            "passvTimeout": json.passvTimeout,
            "keepalive": json.keepalive,
            "ignore": json.ignore
        };
        resolve(ftpSettings);
    });
}