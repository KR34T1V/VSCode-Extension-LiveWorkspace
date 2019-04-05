import * as name from '../constants';
import * as fs from 'fs';
import * as ftpClient from 'ftp';
import * as ft from './../functions';
import * as i from '../interfaces';

export function extractFTPSettings (json: i.SettingsJSON): i.FtpSettingsJSON {
    let ftpSettings = {
        "host": json.host,
        "port": json.port,
        "user": json.username,
        "password": json.password,
        "connTimeout": json.connTimeout,
        "passvTimeout": json.passvTimout,
        "keepalive": json.keepalive
    };

    return ftpSettings;
}

export function remoteListFTP (path: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();

    return new Promise (function (res, rej) {
        
        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
    
            remote.list(path, function(err, list){
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError List => ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tList (Remote->Local) => ${path}`);
                }
                remote.end();
                res(list);
            });
        });
    });
}

export function remoteGetFTP (path: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((res, rej)=>{

        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function () {
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.get(path, function (err, stream) {
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError Get => ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tGet (Remote->Local) => ${path}`);
                }
                stream.once('close', function () {
                    remote.end();
                });
                stream.pipe(fs.createWriteStream(path));
            });
        });

    });
}

export function remotePutFTP (src: string, dest: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((res, rej)=>{
        
        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function () {
            remote.put(src, dest, function (err) {
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError Put => ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tPut (Local->Remote) => ${src}`);
                }
                remote.end();
            });
        });

    });
}

export function remoteRenameFTP (src: string, dest: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((res, rej)=>{
        
        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.rename(src, dest, function (err) {
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError Rename => ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tRenamed => (${src} -> ${dest})`);
                }
            });
        });

    });
}

export function remoteDeleteFTP (path: string, settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((res, rej)=>{

        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.delete(path, function (err) {
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError Delete ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tDeleted => ${path}`);
                }
            });
        });

    });
}

export function remoteAbortFTP (settings: i.FtpSettingsJSON) {
    let remote = new ftpClient();
    
    return new Promise ((res, rej)=>{
        
        remote.connect(settings);
        remote.on('error',function(error) {
            name.VSCODE_OUTPUT.appendLine(`Oops, ${error}`);
            throw(error);
        });
        remote.on('ready', function(){
            name.VSCODE_OUTPUT.appendLine('FTP: connected!');
            remote.abort(function (err) {
                if (err){
                    name.VSCODE_OUTPUT.appendLine(`\tError Abort => ${err}`);
                    throw(err);
                }
                else {
                    name.VSCODE_OUTPUT.appendLine(`\tAborted All Transfers!`);
                }
            });
        });

    });
}