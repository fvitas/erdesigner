'use strict'

import { h, Component } from 'preact'
import { createStore } from 'redux'
import Counter from './counter'
import counter from '../stores/counter'

const store = createStore(counter)

class App extends Component {
    render () {
        this.setState({ counters: store.getState() })

        return (
            <div>
                {this.state.counters.map((value, index) => (
                    <Counter
                        value={value}
                        key={index}
                        onIncrement={() => store.dispatch({ type: 'INCREMENT', index })}
                        onDecrement={() => store.dispatch({ type: 'DECREMENT', index })}
                        onRemoveCounter={() => store.dispatch({ type: 'REMOVE_COUNTER', index })}
                    />
                ))}

                <hr />

                <button onClick={() => store.dispatch({ type: 'ADD_COUNTER' })}>
                    Add counter
                </button>
                <button onClick={() =>
                    store.dispatch({
                        type: 'REMOVE_COUNTER',
                        index: this.state.counters.length - 1
                    })
                }>
                    Remove counter
                </button>
            </div>
        )
    }
}

export default App
