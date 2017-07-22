import { h, Component } from 'preact'
import { bind } from 'decko'

class NodeResize extends Component {
    @bind
    startNodeResizeNW(event) { this.props.onStartNodeResize(event, 'NW') }
    @bind
    startNodeResizeNE(event) { this.props.onStartNodeResize(event, 'NE') }
    @bind
    startNodeResizeSW(event) { this.props.onStartNodeResize(event, 'SW') }
    @bind
    startNodeResizeSE(event) { this.props.onStartNodeResize(event, 'SE') }

    render() {
        return (
            <div class='node-resize'>
                {/* <div class='circle top left' onMouseDown={this.startNodeResizeNW} /> */}
                {/* <div class='circle top right' onMouseDown={this.startNodeResizeNE} /> */}
                {/* <div class='circle bottom left' onMouseDown={this.startNodeResizeSW} /> */}
                {/* <div class='circle bottom right' onMouseDown={this.startNodeResizeSE} /> */}

                <svg onMouseDown={this.startNodeResizeNW} class='top left' width='14' height='14' > <path d='M1,1 L7,1 L7,7 L13,7 L13,13 L1,13 z' /> </svg>
                <svg onMouseDown={this.startNodeResizeNE} class='top right' width='14' height='14' > <path d='M1,1 L7,1 L7,7 L13,7 L13,13 L1,13 z' /> </svg>
                <svg onMouseDown={this.startNodeResizeSW} class='bottom left' width='14' height='14' > <path d='M1,1 L7,1 L7,7 L13,7 L13,13 L1,13 z' /> </svg>
                <svg onMouseDown={this.startNodeResizeSE} class='bottom right' width='14' height='14' > <path d='M1,1 L7,1 L7,7 L13,7 L13,13 L1,13 z' /> </svg>
            </div>
        )
    }
}

export default NodeResize
