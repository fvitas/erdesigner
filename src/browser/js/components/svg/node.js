'use strict'

import { h, Component } from 'preact'
import { bind } from 'decko'

class Node extends Component {
    constructor ({x, y}) {
        super()

        let xCoord = x - 25
        let yCoord = y - 50

        this.state = {
            shouldMove: false,
            x: xCoord,
            y: yCoord,
            dragX: xCoord,
            dragY: yCoord
        }
    }

    @bind
    onMouseDown (event) {
        event.preventDefault()
        this.setState({
            shouldMove: true,
            startDragX: event.clientX,
            startDragY: event.clientY
        })
    }

    @bind
    onMouseMove (event) {
        console.log(this, this.state)
        if (this.state.shouldMove) {
            this.setState({
                dragX: this.state.x + event.clientX - this.state.startDragX,
                dragY: this.state.y + event.clientY - this.state.startDragY
            })
        }
    }

    @bind
    onMouseUp () {
        this.setState({
            shouldMove: false,
            x: this.state.dragX,
            y: this.state.dragY
        })
    }

    render () {
        let translate = `translate(${this.state.dragX}, ${this.state.dragY})`

        return (
            <g transform={translate}>
                <circle r='10' fill='red'>
                    <text>X</text>
                </circle>
                <rect id='SvgRect' width='100' height='50' fill='#ff807f'
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />
            </g>
        )
    }
}

export default Node
