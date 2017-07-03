import { v4 } from 'uuid'
import { ACTION } from './../actions'
import _ from 'lodash'

const actions = {
    addNode(state, action) {
        let newState = _.cloneDeep(state)

        newState.push({
            nodeId: v4(),
            nodeName: action.value.type.replace(/-/, ' '),
            type: action.value.type,
            x: action.value.x - 25,
            y: action.value.y - 50,
            width: 100,
            height: 50
        })

        return newState
    },

    removeNode(state, action) {
        let newState = _.cloneDeep(state)

        return newState.filter(node => node.nodeId !== action.value.nodeId)
    },

    removeAllNode() {
        return []
    },

    updateNode(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        nodeForUpdate.x = action.value.x
        nodeForUpdate.y = action.value.y

        return newState
    },

    updateNodeName(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        nodeForUpdate.nodeName = action.value.nodeName

        return newState
    },

    addColorToNode(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        nodeForUpdate.color = action.value.color

        return newState
    },

    removeColorFromNodes(state) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => { node.color = null })

        return newState
    }
}

export default function nodeReducer(state = [], action) {
    switch (action.type) {
        case ACTION.ADD_NODE: return actions.addNode(state, action)
        case ACTION.REMOVE_NODE: return actions.removeNode(state, action)
        case ACTION.REMOVE_ALL_NODE: return actions.removeAllNode(state)
        case ACTION.UPDATE_NODE: return actions.updateNode(state, action)
        case ACTION.NODE_CHANGE_NAME: return actions.updateNodeName(state, action)
        case ACTION.NODE_ADD_COLOR: return actions.addColorToNode(state, action)
        case ACTION.NODE_REMOVE_COLOR: return actions.removeColorFromNodes(state, action)
        default: return state
    }
}
