import * as fs from 'fs';
import * as vscode from 'vscode';
import { VSCODE_OUTPUT, EXTENSION_NAME } from '../constants';

export function logAction(func: String, msg?: String){
	if (vscode.workspace.workspaceFolders){
		let newUri:vscode.Uri = vscode.workspace.workspaceFolders[0].uri.toJSON();
		let path:vscode.Uri = vscode.Uri.file(`${newUri.fsPath}/.vscode/${EXTENSION_NAME}.log`);
		let date = new Date;
		let output = `${date} | Action: (${func}) "${msg}"\n`;
		fs.appendFileSync(`${path.fsPath}`,output);
	} else {
		VSCODE_OUTPUT.appendLine("Warning: No workspace detected, Logging disabled");
	}
}