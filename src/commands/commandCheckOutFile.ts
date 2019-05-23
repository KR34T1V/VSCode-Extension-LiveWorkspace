import { localGetSettingsJSON } from '../fileExplorer';
import { FtpNode } from '../interfaces';
import { FtpFileStream } from './classFtpFileStream';

export function checkOutFile(node: FtpNode) {
    localGetSettingsJSON()
    .then((settings)=>{
        var stream = new FtpFileStream(settings);
        stream.ftpCheckOut(node);
    });
}