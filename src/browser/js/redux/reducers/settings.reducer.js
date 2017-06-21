import {ACTION} from '../actions'

const actions = {
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
    }
}

export default function settingsReducer(state = {}, action) {
    switch (action.type) {
        case ACTION.SELECT_NODE: return actions.selectNodes(state)
        case ACTION.CONNECT_NODE: return actions.connectNodes(state)
        case ACTION.START_DRAWING: return actions.startDrawing(state)
        case ACTION.STOP_DRAWING: return actions.stopDrawing(state)
        default: return state
    }
}
