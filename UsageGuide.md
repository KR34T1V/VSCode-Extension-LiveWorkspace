# Live-Workspace Guide

## Getting Started

### Step 1:

Create a local directory to host your workspace,
>Make sure your have read/write rights in the directory

It can be anywhere and its location is based on preference.

---

### Step 2:

Run the setup command to create a settings template within your workspace. To do this:

Open the command palette:
>Press F1

Run Setup
>Run `Setup Live Workspace`
---

### Step 3:

Populate the settings file according to your connection.

    {
        "profile": "default", 
        "protocol": "ftp",      //Required: Connection Protocol (ftp/sftp)
        "host": "localhost",    //Required: Connection Host Address
        "port": "21",           //Required: Connection Port
        "remotePath": "/",      //Optional: Remote Working Directory

        "username": "User",     //Required: Connection Username
        "password": "*******",  //Required: Connection Password
        "saveOnUpload": true,   //Optional: Save Files before Checkin/Upload

        "ignore": [             //Optional: Files/Directories to hide
            "*/.DS_Store",
            "*/.vscode/*",
            "*/.git/*",
            "*/*.LCK"
        ]

        "connTimeout": 10000,   //Optional: Connection Timeout
        "passvTimeout": 10000,   //Optional: Connection PASV Timeout
        "keepalive": 10000,     //Optional: Interval To send a NOOP
        "keepaliveMaxCount": 10000
    }
---

## Settings:
### Live-Workspace.json
#### Profile:
>Currently has no effect.
#### Protocol:
Choose which protocol to use for the connection.
>Options: `"ftp"` or ~~`"sftp"`~~

#### Host
Connection host address to which to connect.
>`"host": string`

#### Port
Connection port to connect to.
>`"port": number`

#### RemotePath
Remote path to display in the workspace.
>`"remotePath": path`

#### Username
Username used to connect to the remote server.
>`"username:" string`

#### Password
Password used to connect to the remote server.
>`"password": string`

#### SaveOnUpload
If true will save all files before uploading/Check In
>`"saveOnUpload": boolean`

#### Ignore
Array of items to hide from the Live-Workspace view. (Pathlike items)
>`"ignore": [ string ]`

#### ConnTimeout
Time before connection fails in milliseconds.
>`"connTimeout": number`

#### PassvTimeout
Time before the PASV connection fails in milliseconds.
>`"passvTimeout": number`

#### Keepalive 
How often to send a NOOP to keep the connection alive.
>`"keepalive": number`

#### KeepaliveMaxCount
Maximum number of connections to keep alive
>`"keepaliveMaxCount": number`

### Vscode Settings

#### Username
The username that will be used to reserve files on the server
>`"live-workspace.username": string`

---

### Step 4

Navigate to the Live-Workspace icon on the left side of the screen.

#### Checkout:
In order to work on a file it must first be reserved, to prevent others from working on it at the same time.

You can accomplish this by right clicking on the file you wish to edit in the file tree view, and choosing the `Checkout` command.

This will lock the file on the server and prevent people from overwriting your work.

---
#### Check In
In order for others to gain access to a file that you have reserved, it must first be unlocked by the reservee.

You can accomplish this if you are the reservee, by right clicking on the file you wish to release  in the file tree view, and choosing the `Check In` command.

This will unlock the file on the server and allow other users to reserve the file.

---
#### Download

In order to sync a local copy of a file with the remote version you can use the Download command.

To accomplish this you must be the reservee of the target file, and can right click on it in the file tree view. Choose the `Download` command

This will update your local file to match the remote file.

---
#### Upload

In order for the remote server to be update with your file without having to check in, you can use the `Upload` command.

To accomplish this you must be the reservee of the target file, and can right click on it in the file tree view. Choose the `Upload` command.

This will update the remote server file to match your local file.

---
#### New File
You can create new files straight to the remote server in any target directory.

To accomplish this you simply need to right click on the target directory or a target within the directory, in the file tree view and choose the `New File` command.

This will create a new folder straight onto the remote server at the target position.

---
#### New Folder
You can create new direcories straight onto the remote server in any target directory.

To accomplish this you simply need to right click on the target directory or a target within the directory, in the file tree view and choose the `New Folder` command.

This will create a new directory straight onto the remote server at the target position.

---
#### Delete
You can delete files and direcories from the server.

In order to accomplish this, right click on the target file/directory and select the `Delete` command.

This will remove the target from the server aswell as any sub files/directories.

---
#### Rename
You can rename files/directories on the server.

To accomplish this, right click on the target file/directory and select the `Rename` command.

This will open a text box and rename the file/directory according to your input.