'use strict'

import { h, Component } from 'preact'
import { bind } from 'decko'

import nodeStore from './../stores/node-store'

class NodePicker extends Component {
    @bind
    addNode(event) {
        nodeStore.dispatch({
            type: 'ADD_NODE',
            value: {x: event.clientX, y: event.clientY}
        })
    }

    render() {
        return (
            <div class='node-picker'>
                <label class='toggle-label' htmlFor='toggle'>open/close</label>
                <input class='toggle-button' id='toggle' type='checkbox' />
                <ul class='node-picker-list'>
                    <li class='node' draggable='true' onDragEnd={this.addNode} />
                    <li class='node' draggable='true' onDragEnd={this.addNode} />
                    <li class='node' draggable='true' onDragEnd={this.addNode} />
                    <li class='node' draggable='true' onDragEnd={this.addNode} />
                    <li class='node' draggable='true' onDragEnd={this.addNode} />
                </ul>
            </div>
        )
    }
}

export default NodePicker
