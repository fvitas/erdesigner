'use strict'

import { h, Component } from 'preact'

class NodePicker extends Component {
    render () {
        return (
            <div class='node-picker'>
                <label class='toggle-label' htmlFor='toggle'>open/close</label>
                <input class='toggle-button' id='toggle' type='checkbox' />
                <ul class='node-picker-list'>
                    <li class='node' draggable='true' onDragEnd={() => console.log('add 1')} />
                    <li class='node' draggable='true' onDragEnd={() => console.log('add 2')} />
                    <li class='node' draggable='true' onDragEnd={() => console.log('add 3')} />
                    <li class='node' draggable='true' onDragEnd={() => console.log('add 4')} />
                    <li class='node' draggable='true' onDragEnd={() => console.log('add 5')} />
                </ul>
            </div>
        )
    }
}

export default NodePicker
