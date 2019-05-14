import { localGetSettingsJSON } from '../fileExplorer';
import { ftpGetSettingsJSON } from '../fileTransferProtocol';
import { FtpNode } from '../interfaces';
import { FtpFileStream } from './classFtpFileStream';

export function checkOutFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((json)=>ftpGetSettingsJSON(json))
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpCheckOut(node);
    });
}