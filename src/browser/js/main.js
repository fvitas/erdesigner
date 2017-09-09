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
function generateGraphFromDB(event, nodes, connections) {
    if (_.isEmpty(nodes)) {
        return
    }

    let centerX = Math.floor(window.innerWidth / 2)
    let centerY = Math.floor(window.innerHeight / 2)

    _.forEach(nodes, node => {
        node.x = centerX
        node.y = centerY
    })

    store.dispatch({
        type: ACTION.GENERATE_GRAPH_FROM_DB,
        value: { nodes, connections }
    })

    let angleInterval = 360 / (nodes.length + 1) // + 1 because first and last must not overlap
    let currentAngle = 0

    let targetNodes = _.map(nodes, function(node) {
        let tx = centerX + 100 * Math.cos(currentAngle)
        let ty = centerY + 100 * Math.sin(currentAngle)

        currentAngle = currentAngle + angleInterval

        return {
            nodeId: node.nodeId,
            tx: tx,
            ty: ty
        }
    })

    let moveInterval = setInterval(function moveNodesWithForceLayout() {
        let nodes = store.getState().nodes

        let moveNodes = []

        _.forEach(nodes, node => {
            let targetNode = _.find(targetNodes, { nodeId: node.nodeId })

            if (!targetNode) return

            if ((Math.abs(node.x - targetNode.tx) > 1) || (Math.abs(node.y - targetNode.ty) > 1)) {
                moveNodes.push({
                    nodeId: node.nodeId,
                    x: node.x + (targetNode.tx - node.x) / 10,
                    y: node.y + (targetNode.ty - node.y) / 10
                })
            }
            let newTarget = {
                deltaX: 0,
                deltaY: 0
            }

            // recalculate possible new target
            _.forEach(nodes, otherNode => {
                if (_.isEqual(node.nodeId, otherNode.nodeId)) return

                let d = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))

                if (d < 150) {
                    let newDeltaX = (otherNode.x - node.x) / 2
                    let newDeltaY = (otherNode.y - node.y) / 2

                    newTarget.deltaX = Math.abs(newDeltaX) > Math.abs(newTarget.deltaX) ? newDeltaX : newTarget.deltaX
                    newTarget.deltaY = Math.abs(newDeltaY) > Math.abs(newTarget.deltaY) ? newDeltaY : newTarget.deltaY
                }
            })

            if (node.x === centerX && node.y === centerY) return

            _.remove(targetNodes, { nodeId: node.nodeId })

            if (newTarget.deltaX !== 0 || newTarget.deltaY !== 0) {
                _.remove(targetNodes, { nodeId: node.nodeId })
                targetNodes.push({
                    nodeId: node.nodeId,
                    tx: node.x - newTarget.deltaX,
                    ty: node.y - newTarget.deltaY
                })
            }
        })

        if (!_.isEmpty(moveNodes)) {
            _.forEach(moveNodes, function(node) {
                store.dispatch({
                    type: ACTION.NODE_MOVE,
                    value: {
                        nodeId: node.nodeId,
                        x: node.x,
                        y: node.y
                    }
                })
            })
        }

        if (_.isEmpty(targetNodes)) {
            clearInterval(moveInterval)
        }
    }, 17)
}

require('electron').ipcRenderer.on('undo', undo)
require('electron').ipcRenderer.on('redo', redo)
require('electron').ipcRenderer.on('delete-node', deleteNode)
require('electron').ipcRenderer.on('duplicate-node', duplicateNode)
require('electron').ipcRenderer.on('generate-graph-from-db', generateGraphFromDB)
