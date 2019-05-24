import * as vscode from 'vscode';
import { basename, dirname } from 'path';
import { localGetSettingsJSON, localUploadOnSave, localExistSettings } from '../fileExplorer';
import { ftpRemoteList, ftpRemoteGet } from '../fileTransferProtocol';
import { FtpNode } from '../interfaces';
import { EXTENSION_NAME } from '../constants';

export class FtpModel {
    private ftpSettings: any;
    private remotePath: any;
    constructor() {
        this.getFtpConfig();
        let watcher = vscode.workspace.createFileSystemWatcher(`${vscode.workspace.rootPath}/.vscode/${EXTENSION_NAME}.json`,false,false,false);
        watcher.onDidChange(()=>{
            this.getFtpConfig();
            vscode.commands.executeCommand('live-workspace.refresh');
        });
        watcher.onDidCreate(()=>{
            this.getFtpConfig();
            vscode.commands.executeCommand('live-workspace.refresh');
        });
    }
    private getFtpConfig (){
        if(localExistSettings()) {
            localGetSettingsJSON()
            .then((result)=>this.ftpSettings = result)
            .then(()=>{
                if (this.ftpSettings.uploadOnSave){                
                    vscode.workspace.onDidSaveTextDocument((doc)=>{
                        localUploadOnSave(doc.uri);
                    });
                }
                this.remotePath = this.ftpSettings.remotePath;
            });
        }
    }

    public get roots(): Thenable<FtpNode[]>{
        return new Promise((resolve)=>{
            ftpRemoteList(this.remotePath, this.ftpSettings)
            .then((result)=>{
                if (result){
                    var data = Object.values(result);
                    var sorted = this.sort(data.map((entry) => { return {resource: vscode.Uri.parse(`ftp://${this.ftpSettings.host}${this.remotePath}${entry.name}`), isDirectory: entry.type === 'd' };}));
                    return resolve(sorted);
                }
                else {
                    return resolve(result);
                }
            });
        });
    }

    public getChildren(node: FtpNode): Thenable<FtpNode[]>{
        return new Promise((resolve)=>{
            ftpRemoteList(node.resource.path, this.ftpSettings)
            .then((result)=>{
                if (result){
                    var data = Object.values(result);
                    var sorted = this.sort(data.map(entry => ({ resource: vscode.Uri.parse(`ftp://${this.ftpSettings.host}${node.resource.path}/${entry.name}`), isDirectory: entry.type === 'd' })));
                    return resolve(sorted);
                }
                else {
                    return resolve(result);
                }
            });
        });
    }

    public getContent(resource: vscode.Uri): Thenable<string> {
        return ftpRemoteGet(resource.path, this.ftpSettings);
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
    //REFACTOR THIS GARBAGE VVVVVV
    /*private ignore(node: FtpNode[]) {
        var TempNode: FtpNode[] = [];
        node.forEach((element1, i) => {
             this.ftpSettings.ignore.forEach( element2 => {
                element2 =  element2.replace('/', '\\/').replace('.','\\.').replace('*','.*');
                var regExp = new RegExp(`^${element2}$`, "i");
                var thePath =  element1.resource.path;
                if(thePath.match(regExp)){
                    TempNode.push(element1);
                }
            });
        });
        return this.FilterFunc(TempNode, node);
    }

    private FilterFunc(IgnoreArray: FtpNode[], NodeArray: FtpNode[]): FtpNode[] {
        IgnoreArray.forEach(elem=> {
            if (NodeArray.includes(elem)) {
                NodeArray.splice(NodeArray.indexOf(elem), 1);
            }
       });
       return NodeArray;
    }*/
    //REFACTOR THIS GARBAGE ^^^^^^^^

}

export class FtpTreeDataProvider implements vscode.TreeDataProvider<FtpNode>, vscode.TextDocumentContentProvider {
    private _onDidChange: vscode.EventEmitter<any> = new vscode.EventEmitter<vscode.Uri>();
    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange: vscode.Event<any> = this._onDidChange.event;
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    
    constructor(private readonly model: FtpModel){ }

    public refresh(): any {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(element: FtpNode): vscode.TreeItem {
        this._onDidChange.fire(element.resource);
        return {
            resourceUri: element.resource,
            collapsibleState: element.isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : void 0,
            command: element.isDirectory ? void 0 : {
                command: 'live-workspace.openFtpResource',
                arguments: [element.resource],
                title: 'Open File'
            },
            contextValue: element.isDirectory ? 'folder' : 'file'
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

    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        return this.model.getContent(uri);
	}
}

export class FtpExplorer {

    constructor (context: vscode.ExtensionContext) {
        var ftpModel;
        var treeDataProvider: any;

        ftpModel = new FtpModel();
        treeDataProvider = new FtpTreeDataProvider(ftpModel);
        vscode.window.createTreeView('live-workspace-remote', { treeDataProvider });
        vscode.commands.registerCommand('live-workspace.refresh', () => treeDataProvider.refresh());
        context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('ftp', treeDataProvider));
    }
}