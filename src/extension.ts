import * as vscode from 'vscode';
import { FtpExplorer, checkOutFile, checkInFile, uploadFile, viewFile, downloadFile, renameFile, deleteFile, createNewFolder, createNewFile, refreshTree, setupWorkspace } from './commands/';
import { EXTENSION_NAME, VSCODE_OUTPUT } from './constants';
import { localCreateSettings, localCreateSettingsFolder, localExistSettingsFolder, localExistSettings } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    console.log(`Congratulations, your extension ${EXTENSION_NAME} is now active!`);
    VSCODE_OUTPUT.appendLine(`${EXTENSION_NAME} is now active!`)
    context.subscriptions.push(vscode.commands.registerCommand('live-workspace.setup', ()=>setupWorkspace()));
        new FtpExplorer(context);
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkout', node => checkOutFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkin', node => checkInFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.upload', node => uploadFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.download', node => downloadFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.rename', node => renameFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.delete', node => deleteFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.newfolder', node => createNewFolder(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.newfile', node => createNewFile(node)));
        vscode.commands.registerCommand('live-workspace.openFtpResource', resource => viewFile(resource));
        vscode.commands.executeCommand('setContext', EXTENSION_NAME +"."+"enabled", true);
}

export function deactivate() {}
