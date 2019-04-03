import * as vscode from 'vscode';

export const EXTENSION_NAME = 'ftp-filecontrol';
export const VSCODE_OUTPUT = vscode.window.createOutputChannel(EXTENSION_NAME);
export const EXTENSION_WORKSPACE_SETTINGS_FOLDER = '.vscode';
export const EXTENSION_SETTINGS_FILE =  EXTENSION_NAME+'.json';
export const DEFAULT_SETTINGS = `
    {
    "profile": "default",
    "host": "localhost",
    "post": "21",
    "username": "defaultUser",
    "password": "*******"
    }`;