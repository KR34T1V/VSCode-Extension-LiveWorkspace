import * as vscode from 'vscode';

export interface SettingsJSON {
    "profile": string | number;
    "protocol": string;
    "host": string;
    "port": number;
    "user": string;
    "password": string;
    "remotePath": string;
    "saveOnUpload": boolean;
    "ignore": Array<string>;
    "connTimeout": number;
    "passvTimeout": number;
    "keepalive": number;
    "keepaliveMaxCount": number;
}

export interface FileRights {
    "user": string;
    "group": string;
    "other": string;
}

export interface FTPListingObject {
    "name":FTPListingObjectItem;
}

export interface FTPListingObjectItem {
    "type": string;
    "name": string;
    "sticky": false;
    "rights": FileRights;
    "acl": boolean;
    "owner": string;
    "group": string;
    "size": number;
    "date": Date;
}

export interface FtpNode {
	resource: vscode.Uri;
	isDirectory: boolean;
}