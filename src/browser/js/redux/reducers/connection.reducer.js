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
            sourceNodeId: action.value.sourceNodeId,
            destinationNodeId: action.value.destinationNodeId,
            x1: action.value.x1,
            y1: action.value.y1,
            x2: action.value.x2,
            y2: action.value.y2
        })

        return newState
    },

    updateConnections(state, action) {
        let newConnections = _.cloneDeep(state)

        newConnections.forEach(connection => {
            if (connection.sourceNodeId === action.value.nodeId) {
                connection.x1 = action.value.x + action.value.width / 2
                connection.y1 = action.value.y + action.value.height / 2
            }
            if (connection.destinationNodeId === action.value.nodeId) {
                connection.x2 = action.value.x + action.value.width / 2
                connection.y2 = action.value.y + action.value.height / 2
            }
        })

        return newConnections
    },

    updateNodeConnection(state, action) {
        let newConnections = _.cloneDeep(state)

        newConnections.forEach(connection => {
            if (connection.sourceNodeId === action.value.nodeId) {
                connection.x1 = action.value.x + action.value.width / 2
                connection.y1 = action.value.y + action.value.height / 2
            }
            if (connection.destinationNodeId === action.value.nodeId) {
                connection.x2 = action.value.x + action.value.width / 2
                connection.y2 = action.value.y + action.value.height / 2
            }
        })

        return newConnections
    },

    importConnection(state, action) {
        return _.isArray(action.value.connections) ? action.value.connections : _.cloneDeep(state)
    }
}

export default function connectionReducer(state = [], action) {
    switch (action.type) {
        case ACTION.REMOVE_NODE: return actions.removeNode(state, action)
        case ACTION.REMOVE_ALL_NODE: return actions.removeAllNode(state)
        case ACTION.UPDATE_NODE: return actions.updateNodeConnection(state, action)
        case ACTION.ADD_CONNECTION: return actions.addConnection(state, action)
        case ACTION.UPDATE_CONNECTIONS: return actions.updateConnections(state, action)
        case ACTION.IMPORT: return actions.importConnection(state, action)
        default: return state
    }
}
