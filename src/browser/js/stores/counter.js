'use strict'

const counter = (state = [0], action) => {
    switch (action.type) {
        case 'ADD_COUNTER': return addCounter(state)
        case 'REMOVE_COUNTER': return removeCounter(state, action.index)
        case 'INCREMENT': return incrementCounter(state, action.index)
        case 'DECREMENT': return decrementCounter(state, action.index)
        default: return state
    }
}

const addCounter = (previousCounters) => {
    return [...previousCounters, 0]
}

const removeCounter = (previousCounters, index) => {
    return [
        ...previousCounters.slice(0, index),
        ...previousCounters.slice(index + 1)
    ]
}

const incrementCounter = (previousCounters, index) => {
    return [
        ...previousCounters.slice(0, index),
        previousCounters[index] + 1,
        ...previousCounters.slice(index + 1)
    ]
}

const decrementCounter = (previousCounters, index) => {
    return [
        ...previousCounters.slice(0, index),
        previousCounters[index] - 1,
        ...previousCounters.slice(index + 1)
    ]
}

export default counter
