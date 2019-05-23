import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";
import { autoSaveFile } from "./commandSaveFile";

export function uploadFile (node: FtpNode) {
    localGetSettingsJSON()
    .then((settings)=>{
        autoSaveFile(node.resource,settings)
        .then(()=>{
            var stream = new FtpFileStream(settings);
            stream.ftpUpload(node);
        });
    });
}