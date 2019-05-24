import * as vscode from 'vscode';
import * as fs from 'fs';

export function localExistFile (path: string): boolean {
    var root = vscode.workspace.rootPath;
    if (fs.existsSync(`${root}/${path}`)){
        return(true);
    }
    else{
        return(false);
    }
}