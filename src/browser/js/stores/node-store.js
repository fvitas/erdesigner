'use strict'

import { createStore } from 'redux'

const addNode = (previousNodes, value) => {
    return [
        ...previousNodes,
        {
            x: value.x,
            y: value.y
        }
    ]
}

const nodeReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NODE': return addNode(state, action.value)
        default: return state
    }
}

const nodeStore = createStore(nodeReducer)

export default nodeStore
