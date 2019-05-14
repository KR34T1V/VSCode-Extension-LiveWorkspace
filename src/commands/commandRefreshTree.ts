import * as vscode from 'vscode';

export function refreshTree() {
    vscode.commands.executeCommand('live-workspace.refresh');
}