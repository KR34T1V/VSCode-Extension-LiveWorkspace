import * as vscode from 'vscode';

export function saveFiles () {
    return vscode.workspace.saveAll(false);
}