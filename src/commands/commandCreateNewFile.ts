import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { ftpGetSettingsJSON } from "../fileTransferProtocol";
import { FtpFileStream } from "./classFtpFileStream";
import { refreshTree } from "./commandRefreshTree";

export function createNewFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then(async (settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpNewFile(node);
    });
}