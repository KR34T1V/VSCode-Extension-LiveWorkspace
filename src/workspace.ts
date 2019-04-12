import * as vscode from 'vscode';

export interface FtpNode {

	resource: vscode.Uri;
    isDirectory: boolean;

}

export class FtpTreeDataProvider implements vscode.TreeDataProvider<FtpNode> {

	public getTreeItem(element: FtpNode): any {
        var root = vscode.workspace.rootPath;
        return {
			resourceUri: vscode.Uri.parse(`file://${root}/.vscode/`) ,
			collapsibleState: void 0,
			command: {}
        };
	}
	public getChildren(): any {
        var element = vscode.Uri.parse(`file://`) ;
        
        return([{resource: element, isDirectory: true}]);
	}
	public getParent(): any{
    }
}

export function populateTree () {
    var provider =  new FtpTreeDataProvider();
    const ftpViewer: vscode.TreeView<FtpNode> = vscode.window.createTreeView('live-workspace-remote', {treeDataProvider: provider});
}