'use strict'

import { createStore } from 'redux'
import { v4 } from 'uuid'

const addNode = (previousNodes, value) => {
    return [
        ...previousNodes,
        {
            nodeId: v4(),
            x: value.x,
            y: value.y
        }
    ]
}

const removeNode = (previousNodes, value) => {
    let indexOfNodeForDeletion = previousNodes.findIndex(node => node.nodeId === value.nodeId)

    return [
        ...previousNodes.slice(0, indexOfNodeForDeletion),
        ...previousNodes.slice(indexOfNodeForDeletion + 1)
    ]
}

const nodeReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NODE': return addNode(state, action.value)
        case 'REMOVE_NODE': return removeNode(state, action.value)
        default: return state
    }
}

const nodeStore = createStore(nodeReducer)

export default nodeStore
