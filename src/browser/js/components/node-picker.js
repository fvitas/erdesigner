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
            </div>
        )
    }
}

export default NodePicker
