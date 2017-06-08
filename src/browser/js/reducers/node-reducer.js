'use strict'

const nodeReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NODE': return addNode(state, action.value)
        default: return state
    }
}

const addNode = (previousNodes, value) => {
    return [
        ...previousNodes,
        {
            x: value.x,
            y: value.y
        }
    ]
}

export default nodeReducer
