import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";

export function downloadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpDownload(node);
    });
}