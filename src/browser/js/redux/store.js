import { combineReducers, createStore } from 'redux'
import nodeReducer from './reducers/node.reducer'
import connectionReducer from './reducers/connection.reducer'
import settingsReducer from './reducers/settings.reducer'
import { ACTION } from './actions'

let HISTORY = []
let HISTORY_INDEX = -1

function undo() {
    if (HISTORY_INDEX === 0) {
        return HISTORY[HISTORY_INDEX]
    }

    return HISTORY[--HISTORY_INDEX]
}

function redo() {
    if (HISTORY.length === HISTORY_INDEX + 1) {
        return HISTORY[HISTORY_INDEX]
    }

    return HISTORY[++HISTORY_INDEX]
}

const otherReducers = combineReducers({
    nodes: nodeReducer,
    connections: connectionReducer,
    settings: settingsReducer
})

const historyReducer = (state, action) => {
    switch (action.type) {
        case ACTION.UNDO: return undo(state)
        case ACTION.REDO: return redo(state)
        case ACTION.REDUX_INIT:
            let initState = otherReducers(state, action)

            HISTORY[++HISTORY_INDEX] = initState

            return initState

        default:
            let newState = otherReducers(state, action)

            if (historyStateActions.includes(action.type)) {
                HISTORY.length = HISTORY_INDEX + 1 // cut future
                HISTORY[++HISTORY_INDEX] = newState
            }

            return newState
    }
}

let historyStateActions = [
    ACTION.REMOVE_NODE,
    ACTION.REMOVE_ALL_NODE,
    ACTION.ADD_CONNECTION,
    ACTION.ADD_NODE,
    ACTION.UPDATE_NODE,
    ACTION.NODE_CHANGE_NAME,
    ACTION.ZOOM_IN,
    ACTION.ZOOM_OUT,
    ACTION.NODE_TO_FRONT,
    ACTION.NODE_TO_BACK,
    ACTION.IMPORT
]

// const store = createStore(rootReducer, applyMiddleware(historyMiddleware))
const store = createStore(historyReducer)

export default store
