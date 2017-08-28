const electron = require('electron')
const path = require('path')

// In main process.
const ipcMain = require('electron').ipcMain

const {app, BrowserWindow, Menu} = electron

let mainWindow = null
let sqlWindow = null

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1
}

function isMac() {
    return process.platform === 'darwin'
}

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open...',
                accelerator: 'CmdOrCtrl+O',
                click() { mainWindow.webContents.send('import-file') }
            },
            {
                label: 'Save...',
                accelerator: 'CmdOrCtrl+S',
                click() { mainWindow.webContents.send('export-file') }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                click() { mainWindow.webContents.send('undo') }
            },
            {
                label: 'Redo',
                accelerator: 'CmdOrCtrl+Shift+Z',
                click() { mainWindow.webContents.send('redo') }
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            },
            {
                type: 'separator'
            },
            {
                label: 'Delete Node',
                accelerator: 'Backspace',
                click() { mainWindow.webContents.send('delete-node') }
            },
            {
                label: 'Delete Node',
                accelerator: 'Delete',
                click() { mainWindow.webContents.send('delete-node') }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Toggle Fullscreen',
                accelerator: 'CmdOrCtrl+F',
                role: 'togglefullscreen'
            }
        ]
    }
]

if (isDev()) {
    template.push({
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: isMac() ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click() { mainWindow.webContents.toggleDevTools() }
            }
        ]
    })
}

if (isMac()) {
    template.unshift({
        label: 'ER Designer',
        submenu: [
            {
                label: 'About ER Designer',
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ER Designer',
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() { app.quit() }
            }
        ]
    })
}

app.on('ready', () => {
    console.log('Application is ready for start.')

    mainWindow = new BrowserWindow({
        width: 1150,
        height: 700,
        useContentSize: true,
        nodeIntegration: true,
        webPreferences: {
            experimentalFeatures: true
        }
    })

    mainWindow.loadURL('file://' + path.join(__dirname, '/../index.html'))

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    if (isDev()) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.once('ready-to-show', () => { mainWindow.show() })
    mainWindow.on('closed', () => { mainWindow = null })
})

app.on('window-all-closed', app.quit)

ipcMain.on('show-sql', (event, sql) => {
    if (!sqlWindow) {
        sqlWindow = new BrowserWindow({
            width: 1000,
            height: 500,
            alwaysOnTop: true,
            useContentSize: true,
            nodeIntegration: true,
            webPreferences: {
                experimentalFeatures: true
            }
        })
    }

    sqlWindow.loadURL('file://' + path.join(__dirname, '/../sql-window.html'))

    sqlWindow.sql = sql

    if (isDev()) {
        sqlWindow.webContents.openDevTools()
    }

    sqlWindow.on('closed', () => {
        sqlWindow = null
    })
})
