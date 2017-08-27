import { v4 } from 'uuid'
import { ACTION } from './../actions'
import _ from 'lodash'
import NODE_TYPE from './../../constants/node-type'

// check if source or destination is inheritance node, and if it is check if contains parent
function inheritanceNodeContainsParent(source, destination) {
    return (source.type !== NODE_TYPE.INHERITANCE && destination.type !== NODE_TYPE.INHERITANCE) || source.parent || destination.parent
}

const actions = {
    addNode(state, action) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => { node.selected = false })

        newState.push({
            nodeId: v4(),
            nodeName: action.value.type.replace(/-/, ' '),
            type: action.value.type,
            attributes: [],
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

        let inheritanceNodes = newState.filter(node => node.type === NODE_TYPE.INHERITANCE)

        _.forEach(inheritanceNodes, node => {
            if (node.parent === action.value.nodeId) {
                delete node.parent
            }
        })

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
    },

    moveNodeToFront(state) {
        let newState = _.cloneDeep(state)
        let removedNodes = _.remove(newState, { selected: true })

        if (removedNodes) {
            newState.push(...removedNodes)
        }

        return newState
    },

    moveNodeToBack(state) {
        let newState = _.cloneDeep(state)
        let removedNodes = _.remove(newState, { selected: true })

        if (removedNodes) {
            newState.unshift(...removedNodes)
        }

        return newState
    },

    moveNodesOnCanvas(state, action) {
        let newState = _.cloneDeep(state)

        _.forEach(newState, node => {
            node.x += action.value.x
            node.y += action.value.y
        })

        return newState
    },

    addAttributeToNode(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        let attributeExists = _.find(nodeForUpdate.attributes, { name: action.value.attribute.name })

        if (!attributeExists) {
            nodeForUpdate.attributes.push(action.value.attribute)
        }

        return newState
    },

    deleteAttributeToNode(state, action) {
        let newState = _.cloneDeep(state)

        let nodeForUpdate = _.find(newState, { nodeId: action.value.nodeId })
        _.remove(nodeForUpdate.attributes, { name: action.value.attributeName })

        return newState
    },

    addConnection(state, action) {
        let sourceNode      = _.find(state, { nodeId: action.value.source.nodeId })
        let destinationNode = _.find(state, { nodeId: action.value.destination.nodeId })

        if (inheritanceNodeContainsParent(sourceNode, destinationNode)) {
            return state
        }

        let newState = _.cloneDeep(state)

        let inheritanceNode = sourceNode.type === NODE_TYPE.INHERITANCE ? sourceNode : destinationNode
        let parentNode      = sourceNode.type !== NODE_TYPE.INHERITANCE ? sourceNode : destinationNode

        let nodeForUpdate = _.find(newState, { nodeId: inheritanceNode.nodeId })

        nodeForUpdate.parent = parentNode.nodeId

        return newState
    }
}

export default function nodeReducer(state = [], action) {
    switch (action.type) {
        case ACTION.ADD_NODE: return actions.addNode(state, action)
        case ACTION.DELETE_NODE: return actions.removeNode(state, action)
        case ACTION.DELETE_ALL_NODES: return actions.removeAllNode(state)
        case ACTION.UPDATE_NODE: return actions.updateNode(state, action)
        case ACTION.NODE_CHANGE_NAME: return actions.updateNodeName(state, action)
        case ACTION.NODE_ADD_COLOR: return actions.addColorToNode(state, action)
        case ACTION.NODE_REMOVE_COLOR: return actions.removeColorFromNodes(state, action)
        case ACTION.NODE_SELECT: return actions.selectNode(state, action)
        case ACTION.NODE_DESELECT: return actions.deselectNodes(state, action)
        case ACTION.NODE_RESIZE_DONE: return actions.resizeNode(state, action)
        case ACTION.NODE_TO_FRONT: return actions.moveNodeToFront(state, action)
        case ACTION.NODE_TO_BACK: return actions.moveNodeToBack(state, action)
        case ACTION.IMPORT: return actions.importNodes(state, action)
        case ACTION.MOVE_CANVAS: return actions.moveNodesOnCanvas(state, action)
        case ACTION.ADD_ATTRIBUTE: return actions.addAttributeToNode(state, action)
        case ACTION.DELETE_ATTRIBUTE: return actions.deleteAttributeToNode(state, action)
        case ACTION.ADD_CONNECTION: return actions.addConnection(state, action)
        default: return state
    }
}
