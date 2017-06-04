'use strict'

import { h } from 'preact'

const Counter = ({ value, onIncrement, onDecrement, onRemoveCounter }) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
        <button onClick={onRemoveCounter}>Remove this counter</button>
    </div>
)

export default Counter
