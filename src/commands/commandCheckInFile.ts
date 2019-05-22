import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { ftpGetSettingsJSON } from "../fileTransferProtocol";
import { FtpFileStream } from "./classFtpFileStream";
import { saveFiles } from "./commandSaveFile";

export function checkInFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        saveFiles(settings)
        .then(()=>{
            var stream = new FtpFileStream(settings);
            stream.ftpCheckIn(node);
        });
    });
}