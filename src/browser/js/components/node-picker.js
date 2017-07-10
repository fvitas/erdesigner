import { h, Component } from 'preact'
import { bind } from 'decko'
import {ACTION} from '../redux/actions'

import nodeStore from '../redux/store'

import NODE_TYPE from './../constants/node-type'

class NodePicker extends Component {
    @bind
    dragStarted(event) {
        event.dataTransfer.setDragImage(document.getElementById('node-drag-tween'), 25, 25)
    }

    addNode({type, x, y}) {
        nodeStore.dispatch({
            type: ACTION.ADD_NODE,
            value: {type, x, y}
        })
    }

    @bind
    addNodeEntity(event) {
        this.addNode({type: NODE_TYPE.ENTITY, x: event.clientX, y: event.clientY})
    }

    @bind
    addNodeWeakEntity(event) {
        this.addNode({type: NODE_TYPE.WEAK_ENTITY, x: event.clientX, y: event.clientY})
    }

    @bind
    addNodeAssociativeEntity(event) {
        this.addNode({type: NODE_TYPE.ASSOCIATIVE_ENTITY, x: event.clientX, y: event.clientY})
    }

    @bind
    addNodeAttribute(event) {
        this.addNode({type: NODE_TYPE.ATTRIBUTE, x: event.clientX, y: event.clientY})
    }

    @bind
    addNodeRelationship(event) {
        this.addNode({type: NODE_TYPE.RELATIONSHIP, x: event.clientX, y: event.clientY})
    }

    @bind
    selectNodes() {
        this.setState({connectNodes: false})
        nodeStore.dispatch({type: ACTION.SELECT_NODE})
    }

    @bind
    connectNodes() {
        this.setState({connectNodes: true})
        nodeStore.dispatch({type: ACTION.CONNECT_NODE})
    }

    @bind
    undo() {
        nodeStore.dispatch({type: ACTION.UNDO})
    }

    @bind
    redo() {
        nodeStore.dispatch({type: ACTION.REDO})
    }

    render() {
        return (
            <div class='node-picker'>
                <ul class='node-picker-list'>
                    <li class='node node-entity' draggable='true' onDragStart={this.dragStarted} onDragEnd={this.addNodeEntity} />
                    <li class='node node-weak-entity' draggable='true' onDragStart={this.dragStarted} onDragEnd={this.addNodeWeakEntity} />
                    <li class='node node-associative-entity' draggable='true' onDragStart={this.dragStarted} onDragEnd={this.addNodeAssociativeEntity} />
                    <li class='node node-attribute' draggable='true' onDragStart={this.dragStarted} onDragEnd={this.addNodeAttribute} />
                    <li class='node node-relationship' draggable='true' onDragStart={this.dragStarted} onDragEnd={this.addNodeRelationship} />
                </ul>

                {/* show dragging element tween / every node type should have own dragging tween */}
                <div class='node' id='node-drag-tween' style='position:absolute;left: -1000px' />

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

                    <button onClick={this.undo} >Undo</button>
                    <button onClick={this.redo} >Redo</button>
                </div>
            </div>
        )
    }
}

export default NodePicker
