'use strict'

import { h, Component } from 'preact'
import { bind } from 'decko'
import nodeStore from './../../stores/node-store'

class Node extends Component {
    constructor({nodeId, x, y}) {
        super()

        let xCoord = x - 25
        let yCoord = y - 50

        this.nodeId = nodeId

        this.state = {
            shouldMove: false,
            x: xCoord,
            y: yCoord,
            dragX: xCoord,
            dragY: yCoord
        }
    }

    @bind
    onMouseDown(event) {
        event.preventDefault()
        this.setState({
            shouldMove: true,
            startDragX: event.clientX,
            startDragY: event.clientY
        })

        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
    }

    @bind
    onMouseMove(event) {
        if (this.state.shouldMove) {
            this.setState({
                dragX: this.state.x + event.clientX - this.state.startDragX,
                dragY: this.state.y + event.clientY - this.state.startDragY
            })
        }
    }

    @bind
    onMouseUp() {
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)

        this.setState({
            shouldMove: false,
            x: this.state.dragX,
            y: this.state.dragY
        })
    }

    @bind
    removeNode() {
        nodeStore.dispatch({
            type: 'REMOVE_NODE',
            value: {nodeId: this.nodeId}
        })
    }

    render() {
        let translate = `translate(${this.state.dragX}, ${this.state.dragY})`

        return (
            <g transform={translate}>
                <g transform=' translate(110 -15)' class='node-buttons'>
                    <circle cx='0' cy='0' r='14' fill='#ebebeb' stroke='#c8c8c8' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' />
                    <circle cx='0' cy='0' r='10' fill='#ef4836' stroke='none' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' onClick={this.removeNode} />
                </g>
                <rect id='SvgRect' width='100' height='50' fill='#ff807f' onMouseDown={this.onMouseDown} />
            </g>
        )
    }
}

export default Node
