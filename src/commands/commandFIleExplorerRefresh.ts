import * as vscode from 'vscode';
import { basename, dirname } from 'path';
import { localExistSettings, localGetSettingsJSON } from '../fileExplorer';
import { ftpGetSettingsJSON, ftpRemoteList } from '../fileSystemProtocol';
import { FTPListingObjectItem, SettingsJSON, FtpNode, FtpSettingsJSON } from '../interfaces';
import { VSCODE_OUTPUT } from '../constants';
import { log } from 'util';

function convertUri (SettingsJSON: SettingsJSON, array: object)  {
    var listing: Array<FtpNode> = [];
    return new Promise((resolve)=>{
        
        var Arr = Object.values(array);
        var host = SettingsJSON.host;

        Arr.forEach(function(element: FTPListingObjectItem) {
            listing.push({
                'resource': vscode.Uri.parse(`ftp://${host}${SettingsJSON.remotePath}${element.name}`),
                'isDirectory': element.type === 'd'
            });
        });
        resolve(listing);
    });
}

export async function commandFileExplorerRefresh() {
    if (!localExistSettings()){
        throw (new Error('Settings File not present!'));
    }
    else {
        var SettingsJSON = await localGetSettingsJSON();
        var remotePath = SettingsJSON.remotePath;

        var viewItems = await ftpGetSettingsJSON(SettingsJSON)
        .then((result)=>ftpRemoteList(remotePath, result))
        .then((result)=>convertUri(SettingsJSON, result))
        .then((result)=>{return(result);});
        return(viewItems);
    }
}

export class FtpModel {
    constructor(private remotePath: string, private ftpSettings: FtpSettingsJSON){}

    public get roots(): Thenable<FtpNode[]>{
        return new Promise((resolve)=>{
            ftpRemoteList(this.remotePath, this.ftpSettings)
            .then((result)=>{
               return resolve(this.sort(Object.values(result).map(entry => ({ resource: vscode.Uri.parse(`ftp://${this.ftpSettings.host}///${entry.name}`), isDirectory: entry.type === 'd' }))));
            });
        });
    }

    public getChildren(node: FtpNode): Thenable<FtpNode[]>{
        return new Promise((resolve)=>{
            ftpRemoteList(`${this.remotePath}${node.resource.path}`, this.ftpSettings)
            .then((result)=>{
               return resolve(this.sort(Object.values(result).map(entry => ({ resource: vscode.Uri.parse(`ftp://${this.ftpSettings.host}${node.resource.path}/${entry.name}`), isDirectory: entry.type === 'd' }))));
            });
        });
    }

    private sort(nodes: FtpNode[]): FtpNode[] {
		return nodes.sort((n1, n2) => {
			if (n1.isDirectory && !n2.isDirectory) {
				return -1;
			}
			if (!n1.isDirectory && n2.isDirectory) {
				return 1;
			}
			return basename(n1.resource.fsPath).localeCompare(basename(n2.resource.fsPath));
		});
	}
}

export class FtpTreeDataProvider implements vscode.TreeDataProvider<FtpNode> {

    constructor(private readonly model: FtpModel){ }

	public getTreeItem(element: FtpNode): vscode.TreeItem {
        return {
            resourceUri: element.resource,
            collapsibleState: element.isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : void 0,
            command: void 0
        };
    }
    
	public getChildren(element?: FtpNode): FtpNode[] | Thenable<FtpNode[]> {
        return element ? this.model.getChildren(element) : this.model.roots;
    }
    
    public getParent(element: FtpNode): FtpNode | any {
        const oldResource = element.resource;
        var newPath = dirname(element.resource.path);
        var newResource = {
            scheme: oldResource.scheme,
            authority: oldResource.authority,
            path: newPath,
            query: oldResource.query,
            fragment: oldResource.fragment
        };
        return newResource.path !== '//' ? { resource: newResource, isDirectory: true } : null;
    }
}

export class FtpExplorer {

    constructor (context: vscode.ExtensionContext) {
        var ftpModel;
        var treeDataProvider;
        var remotePath: string;
        var ftpSettings: FtpSettingsJSON;
        if (localExistSettings()){
            localGetSettingsJSON()
            .then((result)=>{
                remotePath = result.remotePath;
                ftpGetSettingsJSON(result)
                .then((result)=>{
                    ftpSettings = result;

                    ftpModel = new FtpModel(remotePath, ftpSettings);
                    treeDataProvider = new FtpTreeDataProvider(ftpModel);
                    vscode.window.createTreeView('live-workspace-remote', { treeDataProvider });
                });
            });
        }
    }
}