import { createStore } from 'redux'
import { v4 } from 'uuid'

const INITIAL_STATE = {
    nodes: [],
    connections: []
}

let HISTORY = {
    past: [],
    present: INITIAL_STATE,
    future: []
}

// Decorator function for adding state into HISTORY
function addToHistory(target, name, descriptor) {
    let originalFunction = descriptor.value

    let historyDecorator = function(currentState, action) {
        let newState = originalFunction.call(target, currentState, action)

        HISTORY = {
            past: [...HISTORY.past, HISTORY.present],
            present: newState,
            future: []
        }

        return newState
    }

    descriptor.value = historyDecorator
    return descriptor
}

const actions = {
    @addToHistory
    addNode(state, action) {
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
    },

    @addToHistory
    removeNode(state, action) {
        let newNodes = state.nodes.filter(node => node.nodeId !== action.value.nodeId)

        let newConnections = state.connections.filter(connection => {
            return connection.sourceNodeId !== action.value.nodeId &&
                connection.destinationNodeId !== action.value.nodeId
        })

        return {
            ...state,
            nodes: [...newNodes],
            connections: [...newConnections]
        }
    },

    selectNodes(state) {
        return {
            ...state,
            shouldConnectNodes: false
        }
    },

    connectNodes(state) {
        return {
            ...state,
            shouldConnectNodes: true
        }
    },

    @addToHistory
    removeAllNode(state) {
        return {
            ...state,
            nodes: [],
            connections: []
        }
    },

    @addToHistory
    addConnection(state, action) {
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
    },

    startDrawing(state) {
        return {
            ...state,
            isDrawingConnection: true
        }
    },

    stopDrawing(state) {
        return {
            ...state,
            isDrawingConnection: false
        }
    },

    @addToHistory
    updateNode(state, action) {
        let newNodes = [...state.nodes].map(node => node.nodeId === action.value.nodeId ? action.value : node)

        return {
            ...state,
            nodes: newNodes
        }
    },

    updateConnections(state, action) {
        return {
            ...state,
            connections: [...action.value]
        }
    },

    undo() {
        const previous = HISTORY.past[HISTORY.past.length - 1]

        HISTORY = {
            past: HISTORY.past.slice(0, HISTORY.past.length - 1),
            present: previous,
            future: [HISTORY.present, ...HISTORY.future]
        }

        return HISTORY.present
    },

    redo() {
        const nextState = HISTORY.future[0]

        HISTORY = {
            past: [...HISTORY.past, HISTORY.present],
            present: nextState,
            future: HISTORY.future.slice(1, HISTORY.future.length)
        }

        return HISTORY.present
    }
}

const nodeReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NODE': return actions.addNode(state, action)
        case 'REMOVE_NODE': return actions.removeNode(state, action)
        case 'REMOVE_ALL_NODE': return actions.removeAllNode(state)
        case 'SELECT_NODE': return actions.selectNodes(state)
        case 'CONNECT_NODE': return actions.connectNodes(state)
        case 'ADD_CONNECTION': return actions.addConnection(state, action)
        case 'START_DRAWING': return actions.startDrawing(state)
        case 'STOP_DRAWING': return actions.stopDrawing(state)
        case 'UPDATE_NODE': return actions.updateNode(state, action)
        case 'UPDATE_CONNECTIONS': return actions.updateConnections(state, action)
        case 'UNDO': return actions.undo(state)
        case 'REDO': return actions.redo(state)
        default: return state
    }
}

const nodeStore = createStore(nodeReducer, INITIAL_STATE)

export default nodeStore
