const electron = require('electron')
const path = require('path')

const {app, BrowserWindow, Menu} = electron

let mainWindow = null

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open...',
                accelerator: 'CmdOrCtrl+O',
                click() {}
            },
            {
                label: 'Save...',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    // We can't call saveFile(content) directly because we need to get
                    // the content from the renderer process. So, send a message to the
                    // renderer, telling it we want to save the file.
                    mainWindow.webContents.send('save-file')
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
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
            }
        ]
    },
    {
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin'
                    ? 'Alt+Command+I'
                    : 'Ctrl+Shift+I',
                click() { mainWindow.webContents.toggleDevTools() }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ' + name,
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
        width: 1000,
        height: 600,
        useContentSize: true,
        nodeIntegration: true,
        webPreferences: {
            experimentalFeatures: true
        }
    })

    mainWindow.loadURL('file://' + path.join(__dirname, '/../index.html'))

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
})

app.on('window-all-closed', app.quit)
