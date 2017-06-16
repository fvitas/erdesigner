import { createStore } from 'redux'
import { v4 } from 'uuid'

const INITIAL_STATE = {
    nodes: [],
    connections: []
}

const addNode = (state, action) => {
    return {
        ...state,
        nodes: [
            ...state.nodes,
            {
                nodeId: v4(),
                x: action.value.x - 25,
                y: action.value.y - 50,
                width: 100,
                height: 50
            }
        ]
    }
}

const removeNode = (state, action) => {
    let indexOfNodeForDeletion = state.nodes.findIndex(node => node.nodeId === action.value.nodeId)

    return {
        ...state,
        nodes: [
            ...state.nodes.slice(0, indexOfNodeForDeletion),
            ...state.nodes.slice(indexOfNodeForDeletion + 1)
        ]
    }
}

function selectNodes(state) {
    return {
        ...state,
        shouldConnectNodes: false
    }
}

function connectNodes(state) {
    return {
        ...state,
        shouldConnectNodes: true
    }
}

const removeAllNode = (state) => {
    return {
        ...state,
        nodes: []
    }
}

function addConnection(state, action) {
    return {
        ...state,
        connections: [
            ...state.connections,
            {
                connectionId: v4(),
                sourceNodeId: action.value.sourceNodeId,
                destinationNodeId: action.value.destinationNodeId,
                x1: action.value.x1,
                y1: action.value.y1,
                x2: action.value.x2,
                y2: action.value.y2
            }
        ]
    }
}

function startDrawing(state) {
    return {
        ...state,
        isDrawingConnection: true
    }
}

function stopDrawing(state) {
    return {
        ...state,
        isDrawingConnection: false
    }
}

function updateConnections(state, action) {
    return {
        ...state,
        connections: [...action.value]
    }
}

const nodeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_NODE': return addNode(state, action)
        case 'REMOVE_NODE': return removeNode(state, action)
        case 'REMOVE_ALL_NODE': return removeAllNode(state)
        case 'SELECT_NODE': return selectNodes(state)
        case 'CONNECT_NODE': return connectNodes(state)
        case 'ADD_CONNECTION': return addConnection(state, action)
        case 'START_DRAWING': return startDrawing(state)
        case 'STOP_DRAWING': return stopDrawing(state)
        case 'UPDATE_CONNECTIONS': return updateConnections(state, action)
        default: return state
    }
}

const nodeStore = createStore(nodeReducer)

export default nodeStore
