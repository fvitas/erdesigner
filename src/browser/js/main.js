import { h, render } from 'preact'
import ERDiagramApp from './components/er-diagram-app'
import { Provider } from 'preact-redux'
import store from './redux/store'
import { ACTION } from './redux/actions'
import _ from 'lodash'

render(
    <Provider store={store}>
        <ERDiagramApp />
    </Provider>,
    document.querySelector('[data-js="app"]')
)

require('electron').ipcRenderer.on('import-file', () => {
    let fs = require('fs')
    let { dialog } = require('electron').remote

    dialog.showOpenDialog(filePaths => {
        if (_.isEmpty(filePaths) || _.size(filePaths) > 1) {
            return
        }

        let file = filePaths[0]
        let importedData = JSON.parse(fs.readFileSync(file, 'utf8'))

        store.dispatch({
            type: ACTION.IMPORT,
            value: importedData
        })
    })
})

//
// -------------- Listeners for keybord shortcuts --------------
//
require('electron').ipcRenderer.on('export-file', () => {
    let fs = require('fs')
    let { dialog } = require('electron').remote

    dialog.showSaveDialog(fileName => {
        if (!fileName) {
            return
        }

        let jsonData = JSON.stringify(store.getState())

        fs.writeFile(fileName + '.json', jsonData, err => {
            if (err) {
                console.error(err)
            }
        })
    })
})

function undo() {
    store.dispatch({type: ACTION.UNDO})
}
function redo() {
    store.dispatch({type: ACTION.REDO})
}
function deleteNode() {
    let selectedNode = _.find(store.getState().nodes, { selected: true })

    if (!selectedNode) {
        return
    }

    store.dispatch({
        type: ACTION.DELETE_NODE,
        value: {nodeId: selectedNode.nodeId}
    })
}
function duplicateNode() {
    let selectedNode = _.find(store.getState().nodes, { selected: true })

    if (!selectedNode) {
        return
    }

    store.dispatch({
        type: ACTION.DUPLICATE_NODE,
        value: {nodeId: selectedNode.nodeId}
    })
}

require('electron').ipcRenderer.on('undo', undo)
require('electron').ipcRenderer.on('redo', redo)
require('electron').ipcRenderer.on('delete-node', deleteNode)
require('electron').ipcRenderer.on('duplicate-node', duplicateNode)
