'use strict'

import { h, Component } from 'preact'

class NodePicker extends Component {
    constructor ({store}) {
        super()
        this.store = store
    }

    addNode (event) {
        this.store.dispatch({
            type: 'ADD_NODE',
            value: {x: event.clientX, y: event.clientY}
        })
    }

    render () {
        return (
            <div class='node-picker'>
                <label class='toggle-label' htmlFor='toggle'>open/close</label>
                <input class='toggle-button' id='toggle' type='checkbox' />
                <ul class='node-picker-list'>
                    <li class='node' draggable='true' onDragEnd={this.addNode.bind(this)} />
                    <li class='node' draggable='true' onDragEnd={this.addNode.bind(this)} />
                    <li class='node' draggable='true' onDragEnd={this.addNode.bind(this)} />
                    <li class='node' draggable='true' onDragEnd={this.addNode.bind(this)} />
                    <li class='node' draggable='true' onDragEnd={this.addNode.bind(this)} />
                </ul>
            </div>
        )
    }
}

export default NodePicker
