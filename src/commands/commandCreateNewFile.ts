import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";

export function createNewFile (node: FtpNode) {
    localGetSettingsJSON()
    .then(async (settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpNewFile(node);
    });
}