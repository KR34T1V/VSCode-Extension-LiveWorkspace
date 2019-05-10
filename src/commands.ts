import { localGetSettingsJSON } from './fileExplorer';
import { ftpRemoteList, ftpGetSettingsJSON } from './fileTransferProtocol';
import { SettingsJSON, FTPListingObjectItem } from './interfaces';

export async function commandRefresh () {
    var settingsJSON: SettingsJSON = await localGetSettingsJSON();
    var path = settingsJSON.remotePath;
    //if sftp
    //FTP
    var settingsFTP = await ftpGetSettingsJSON(settingsJSON);
    console.log(`Path: ${path}`);
    ftpRemoteList(path, settingsFTP)
    .then(function (res: object){
        var Arr = Object.values(res);
        Arr.forEach(function(elem: FTPListingObjectItem) {
            console.log(elem);
        });
    });
}