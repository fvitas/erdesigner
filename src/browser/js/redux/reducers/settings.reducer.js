import _ from 'lodash'
import {ACTION} from '../actions'

const INIT_STATE = {
    shouldConnectNodes: false,
    isDrawingConnection: false,
    zoom: 1
}

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
    },

    zoomNormal(state) {
        return {
            ...state,
            zoom: 1
        }
    },

    zoomIn(state) {
        let currentZoom = state.zoom >= 3
            ? state.zoom
            : state.zoom + 0.1

        return {
            ...state,
            zoom: _.round(currentZoom, 2)
        }
    },

    zoomOut(state) {
        let currentZoom = state.zoom <= 0.1
            ? state.zoom
            : state.zoom - 0.1

        return {
            ...state,
            zoom: _.round(currentZoom, 2)
        }
    },

    importSettings(state, action) {
        let newState = _.isObject(action.value.settings) ? action.value.settings : _.cloneDeep(state)

        return {
            ...newState,
            isDrawingConnection: false,
            shouldConnectNodes: false
        }
    }
}

export default function settingsReducer(state = INIT_STATE, action) {
    switch (action.type) {
        case ACTION.SELECT_NODE: return actions.selectNodes(state)
        case ACTION.CONNECT_NODE: return actions.connectNodes(state)
        case ACTION.START_DRAWING: return actions.startDrawing(state)
        case ACTION.STOP_DRAWING: return actions.stopDrawing(state)
        case ACTION.ZOOM_NORMAL: return actions.zoomNormal(state)
        case ACTION.ZOOM_IN: return actions.zoomIn(state)
        case ACTION.ZOOM_OUT: return actions.zoomOut(state)
        case ACTION.IMPORT: return actions.importSettings(state, action)
        default: return state
    }
}
