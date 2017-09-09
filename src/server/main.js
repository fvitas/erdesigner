const electron = require('electron')
const path = require('path')
const _ = require('lodash')
const uuid = require('uuid')

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
                label: 'Duplicate Node',
                accelerator: 'CmdOrCtrl+D',
                click() { mainWindow.webContents.send('duplicate-node') }
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
        width: 1300,
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
            width: 700,
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

ipcMain.on('fetch-from-db', async (event, connection) => {
    if (/;|drop|--/.test(connection.database)) {
        connection.database = ''
    }

    try {
        let knex = require('knex')({
            client: 'mysql',
            connection: {
                host: connection.host,
                user: connection.user,
                password: connection.password,
                database: connection.database
            }
        })

        let informationShema = require('knex')({
            client: 'mysql',
            connection: {
                host: connection.host,
                user: connection.user,
                password: connection.password,
                database: 'information_schema'
            }
        })

        let tablesResponse = await knex.raw('show tables')

        let tables = _.map(_.first(tablesResponse), x => ({name: _.values(x)[0]}))

        let nodes = []

        for (let table of tables) {
            let tableDetails = await knex.raw(`describe ${table.name}`)

            nodes.push({
                nodeId: uuid.v4(),
                nodeName: table.name,
                type: 'entity',
                selected: false,
                x: 400,
                y: 300,
                width: 100,
                height: 50,
                attributes: _.map(_.first(tableDetails), function(details) {
                    let detailsType = details.Type.toLocaleLowerCase()
                    let attributeType =
                        _.includes(detailsType, 'int') ? 'INTEGER' : _.includes(detailsType, 'char') ? 'CHAR' : _.includes(detailsType, 'float') ? 'FLOAT' : _.includes(detailsType, 'timestamp') ? 'TIMESTAMP' : ''

                    return {
                        name: details.Field,
                        type: attributeType,
                        isPrimary: _.isEqual(details.Key, 'PRI')
                        // Null: "YES" / "NO"
                        // Extra: "auto_increment"
                        // Default: null | value
                    }
                })
            })
        }

        let foreignKeysResponse = await informationShema.raw(`
            SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = '${connection.database}' AND CONSTRAINT_NAME LIKE '%fk%'`
        )

        let foreignKeys = _.first(foreignKeysResponse)
        let connections = []

        _.forEach(foreignKeys, fk => {
            let source = _.find(nodes, {nodeName: fk.TABLE_NAME})
            source.type = 'relationship'

            let destination = _.find(nodes, {nodeName: fk.REFERENCED_TABLE_NAME})
            connections.push({
                connectionId: uuid.v4(),
                source: {
                    nodeId: source.nodeId,
                    x: source.x,
                    y: source.y
                },
                destination: {
                    nodeId: destination.nodeId,
                    x: destination.x,
                    y: destination.y
                }
            })
        })

        mainWindow.webContents.send('generate-graph-from-db', nodes, connections)

        knex.destroy()
        informationShema.destroy()
    } catch (error) {
        console.error(error)
    }
})
