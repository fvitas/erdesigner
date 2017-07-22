import { v4 } from 'uuid'
import { ACTION } from './../actions'
import _ from 'lodash'

const actions = {
    addNode(state, action) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => { node.selected = false })

        newState.push({
            nodeId: v4(),
            nodeName: action.value.type.replace(/-/, ' '),
            type: action.value.type,
            x: action.value.x - 0,
            y: action.value.y - 50,
            selected: true,
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

        _.forEach(newState, node => { node.color = undefined })

        return newState
    },

    importNodes(state, action) {
        return _.isArray(action.value.nodes) ? action.value.nodes : _.cloneDeep(state)
    },

    selectNode(state, action) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => { node.selected = (node.nodeId === action.value.nodeId) })

        return newState
    },

    deselectNodes(state) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => { node.selected = false })

        return newState
    },

    resizeNode(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        nodeForUpdate.x = action.value.x
        nodeForUpdate.y = action.value.y
        nodeForUpdate.width = action.value.width
        nodeForUpdate.height = action.value.height

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
        case ACTION.NODE_SELECT: return actions.selectNode(state, action)
        case ACTION.NODE_DESELECT: return actions.deselectNodes(state, action)
        case ACTION.NODE_RESIZE_DONE: return actions.resizeNode(state, action)
        case ACTION.IMPORT: return actions.importNodes(state, action)
        default: return state
    }
}
