import * as vscode from 'vscode';
import { localExistSettingsFolder, localCreateSettingsFolder, localCreateSettings } from '../fileExplorer';
import { EXTENSION_NAME } from '../constants';

export function setupWorkspace() {
	if (vscode.workspace.workspaceFolders){
		let newUri:vscode.Uri = vscode.workspace.workspaceFolders[0].uri.toJSON();
		let path:vscode.Uri = vscode.Uri.file(`${newUri.fsPath}/.vscode/${EXTENSION_NAME}.json`);
		if (!localExistSettingsFolder(newUri)) {
			localCreateSettingsFolder(newUri)
				.then(() => localCreateSettings(newUri))
				.then(()=>{
					vscode.workspace.openTextDocument(path.fsPath)
					.then((value)=>vscode.window.showTextDocument(value));
			});
		}
		else {
			localCreateSettings(newUri)
			.then(()=>{
				vscode.workspace.openTextDocument(path.fsPath)
				.then((value)=>vscode.window.showTextDocument(value));
		});
		}
	}
}