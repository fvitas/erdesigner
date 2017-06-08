'use strict'

import { h, Component } from 'preact'

class SvgRect extends Component {
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

    render () {
        let translate = `translate(${this.state.dragX}, ${this.state.dragY})`

        return (
            <rect id='SvgRect' width='100' height='50' fill='#ff807f'
                transform={translate}
                onMouseDown={event => {
                    event.preventDefault()
                    this.setState({
                        shouldMove: true,
                        startDragX: event.clientX,
                        startDragY: event.clientY
                    })
                }}
                onMouseMove={event => {
                    if (this.state.shouldMove) {
                        this.setState({
                            dragX: this.state.x + event.clientX - this.state.startDragX,
                            dragY: this.state.y + event.clientY - this.state.startDragY
                        })
                    }
                }}
                onMouseUp={() => {
                    this.setState({
                        shouldMove: false,
                        x: this.state.dragX,
                        y: this.state.dragY
                    })
                }}
            />
        )
    }
}

export default SvgRect
