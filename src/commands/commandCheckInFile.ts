import { FtpNode } from "../interfaces";
import { localGetSettingsJSON } from "../fileExplorer";
import { FtpFileStream } from "./classFtpFileStream";
import { autoSaveFile } from "./commandSaveFile";
import { logAction } from "../logging/logAction";
import { dirname } from "path";

export function checkInFile(node: FtpNode) {
	logAction(`checkInFile(${node.resource.fsPath})`);
    localGetSettingsJSON()
    .then((settings)=>{
        autoSaveFile(node.resource, settings)
        .then(()=>{
            var stream = new FtpFileStream(settings);
            stream.ftpCheckIn(node);
        });
    });
}

