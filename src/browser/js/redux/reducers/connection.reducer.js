import { v4 } from 'uuid'
import _ from 'lodash'
import { ACTION } from './../actions'

const actions = {
    removeNode(state, action) {
        let newState = _.cloneDeep(state)

        return newState.filter(connection => connection.sourceNodeId !== action.value.nodeId && connection.destinationNodeId !== action.value.nodeId)
    },

    removeAllNode() {
        return []
    },

    addConnection(state, action) {
        let newState = _.cloneDeep(state)

        newState.push({
            connectionId: v4(),
            source: action.value.source,
            destination: action.value.destination
        })

        return newState
    },

    updateConnections(state, action) {
        let newConnections = _.cloneDeep(state)

        newConnections.forEach(connection => {
            if (connection.source.nodeId === action.value.nodeId) {
                connection.source.x = action.value.x
                connection.source.y = action.value.y
            }
            if (connection.destination.nodeId === action.value.nodeId) {
                connection.destination.x = action.value.x
                connection.destination.y = action.value.y
            }
        })

        return newConnections
    },

    updateNodeConnection(state, action) {
        let newConnections = _.cloneDeep(state)

        newConnections.forEach(connection => {
            if (connection.source.nodeId === action.value.nodeId) {
                connection.source.x = action.value.x
                connection.source.y = action.value.y
            }
            if (connection.destination.nodeId === action.value.nodeId) {
                connection.destination.x = action.value.x
                connection.destination.y = action.value.y
            }
        })

        return newConnections
    },

    importConnection(state, action) {
        return _.isArray(action.value.connections) ? action.value.connections : _.cloneDeep(state)
    },

    moveNodesOnCanvas(state, action) {
        let newConnections = _.cloneDeep(state)

        let alreadyMovedNodes = []

        newConnections.forEach(connection => {
            // update connection of source node
            if (!_.find(alreadyMovedNodes, connection.source.nodeId)) {
                connection.source.x += action.value.x
                connection.source.y += action.value.y
            }

            alreadyMovedNodes.push(connection.source.nodeId)

            // update connection of source node
            if (!_.find(alreadyMovedNodes, connection.destination.nodeId)) {
                connection.destination.x += action.value.x
                connection.destination.y += action.value.y
            }

            alreadyMovedNodes.push(connection.destination.nodeId)
        })

        return newConnections
    }
}

export default function connectionReducer(state = [], action) {
    switch (action.type) {
        case ACTION.DELETE_NODE: return actions.removeNode(state, action)
        case ACTION.DELETE_ALL_NODES: return actions.removeAllNode(state)
        case ACTION.UPDATE_NODE: return actions.updateNodeConnection(state, action)
        case ACTION.ADD_CONNECTION: return actions.addConnection(state, action)
        case ACTION.UPDATE_CONNECTIONS: return actions.updateConnections(state, action)
        case ACTION.IMPORT: return actions.importConnection(state, action)
        case ACTION.MOVE_CANVAS: return actions.moveNodesOnCanvas(state, action)
        default: return state
    }
}
