import * as vscode from 'vscode';
import { FtpExplorer, checkOutFile, checkInFile, uploadFile, viewFile, downloadFile, renameFile, deleteFile, createNewFolder, createNewFile, refreshTree } from './commands/';
import { EXTENSION_NAME } from './constants';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ftp-filecontrol" is now active!');
        new FtpExplorer(context);
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkout', node => checkOutFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.checkin', node => checkInFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.upload', node => uploadFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.download', node => downloadFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.rename', node => renameFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.delete', node => deleteFile(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.newfolder', node => createNewFolder(node)));
        context.subscriptions.push(vscode.commands.registerCommand('live-workspace.newfile', node => createNewFile(node)));
        //context.subscriptions.push(vscode.commands.registerCommand('live-workspace.refresh', () => refreshTree(context)));
        vscode.commands.registerCommand('live-workspace.openFtpResource', resource => viewFile(resource));
        vscode.commands.executeCommand('setContext', EXTENSION_NAME +"."+"enabled", true);
}

export function deactivate() {}
