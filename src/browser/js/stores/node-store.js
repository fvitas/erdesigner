import { createStore } from 'redux'
import { v4 } from 'uuid'

const addNode = (state, value) => {
    return {
        ...state,
        nodes: [
            ...state.nodes,
            {
                nodeId: v4(),
                x: value.x,
                y: value.y
            }
        ]
    }
}

const removeNode = (state, value) => {
    let indexOfNodeForDeletion = state.nodes.findIndex(node => node.nodeId === value.nodeId)

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

const nodeReducer = (state = {nodes: []}, action) => {
    switch (action.type) {
        case 'ADD_NODE': return addNode(state, action.value)
        case 'REMOVE_NODE': return removeNode(state, action.value)
        case 'REMOVE_ALL_NODE': return removeAllNode(state)
        case 'SELECT_NODE': return selectNodes(state)
        case 'CONNECT_NODE': return connectNodes(state)
        default: return state
    }
}

const nodeStore = createStore(nodeReducer)

export default nodeStore
