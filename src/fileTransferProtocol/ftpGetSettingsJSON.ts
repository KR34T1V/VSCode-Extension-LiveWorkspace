import { SettingsJSON, FtpSettingsJSON } from '../interfaces';
export function ftpGetSettingsJSON (json: SettingsJSON):Thenable<FtpSettingsJSON> {
    
    return new Promise((resolve)=>{

        let ftpSettings = {
            "host": json.host,
            "port": json.port,
            "user": json.username,
            "password": json.password,
            "connTimeout": json.connTimeout,
            "passvTimeout": json.passvTimout,
            "keepalive": json.keepalive,
            "ignore": json.ignore
        };
        resolve(ftpSettings);
    });
}