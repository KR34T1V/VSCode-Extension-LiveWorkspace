import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { ftpGetSettingsJSON } from "../fileTransferProtocol";
import { FtpFileStream } from "./classFtpFileStream";
import { refreshTree } from "./commandRefreshTree";

export function downloadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpDownload(node);
    });
}