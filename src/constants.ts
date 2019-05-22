import * as vscode from 'vscode';
export const EXTENSION_NAME = 'Live-Workspace';
export const VSCODE_OUTPUT = vscode.window.createOutputChannel(EXTENSION_NAME);
export const EXTENSION_WORKSPACE_SETTINGS_FOLDER = '.vscode';
export const EXTENSION_SETTINGS_FILE =  EXTENSION_NAME+'.json';
export const DEFAULT_SETTINGS = `
{
    "profile": "default",

    "protocol": "ftp",
    "host": "localhost",
    "port": "21",
    "remotePath": "/",

    "username": "defaultUser",
    "password": "*******",

    "ignore": [
        "*/.DS_Store",
        "*/.vscode/*",
        "*/.git/*",
        "*/*.LCK"
    ]
}`;