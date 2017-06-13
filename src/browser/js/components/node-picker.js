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

    @bind
    selectNodes() {
        this.setState({connectNodes: false})
        nodeStore.dispatch({type: 'SELECT_NODE'})
    }

    @bind
    connectNodes() {
        this.setState({connectNodes: true})
        nodeStore.dispatch({type: 'CONNECT_NODE'})
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

                <div style='
                position: absolute;
                top: 0;
                left: 190px;
                width: 130px;
                margin: 10px;
                '>
                    <input class='' type='radio' name='choose' id='select-nodes' onClick={this.selectNodes} checked={!this.state.connectNodes} />
                    <label htmlFor='select-nodes'>Select</label>
                    <input class='' type='radio' name='choose' id='connect-nodes' onClick={this.connectNodes} checked={this.state.connectNodes} />
                    <label htmlFor='connect-nodes'>Connect</label>
                </div>
            </div>
        )
    }
}

export default NodePicker
