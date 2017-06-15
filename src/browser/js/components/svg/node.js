import { h, Component } from 'preact'
import { bind } from 'decko'
import nodeStore from './../../stores/node-store'

class Node extends Component {
    constructor({nodeId, x, y}) {
        super()

        this.nodeId = nodeId

        this.state = {
            shouldMove: false,
            x: x,
            y: y,
            dragX: x,
            dragY: y,
            width: 100,
            height: 50
        }
    }

    @bind
    onMouseDown(event) {
        event.preventDefault()

        if (nodeStore.getState().shouldConnectNodes) {
            let sourceNode = nodeStore.getState()
                .nodes
                .find(node => node.nodeId === this.nodeId)

            this.props.onDrawConnectionStart(sourceNode)

            nodeStore.dispatch({type: 'START_DRAWING'})

            window.addEventListener('mousemove', this.drawConnection)
            window.addEventListener('mouseup', this.drawConnectionFinished)
        } else {
            this.setState({
                shouldMove: true,
                startDragX: event.clientX,
                startDragY: event.clientY
            })

            window.addEventListener('mousemove', this.moveNode)
            window.addEventListener('mouseup', this.modeNodeFinished)
        }
    }

    @bind
    moveNode(event) {
        if (this.state.shouldMove) {
            this.setState({
                dragX: this.state.x + event.clientX - this.state.startDragX,
                dragY: this.state.y + event.clientY - this.state.startDragY
            })
        }
    }

    @bind
    modeNodeFinished() {
        window.removeEventListener('mousemove', this.moveNode)
        window.removeEventListener('mouseup', this.modeNodeFinished)

        this.setState({
            shouldMove: false,
            x: this.state.dragX,
            y: this.state.dragY
        })

        nodeStore.dispatch({
            type: 'UPDATE_NODE',
            value: {
                nodeId: this.nodeId,
                x: this.state.dragX,
                y: this.state.dragY
            }
        })
    }

    @bind
    removeNode() {
        nodeStore.dispatch({
            type: 'REMOVE_NODE',
            value: {nodeId: this.nodeId}
        })
    }

    @bind
    drawConnection(event) {
        this.props.onDrawConnectionMove(event)
    }

    @bind
    drawConnectionFinished() {
        window.removeEventListener('mousemove', this.drawConnection)
        window.removeEventListener('mouseup', this.drawConnectionFinished)

        this.props.onDrawConnectionEnd()
        nodeStore.dispatch({type: 'STOP_DRAWING'})
    }

    @bind
    onConnectionEnterDestination() {
        if (nodeStore.getState().isDrawingConnection && nodeStore.getState().shouldConnectNodes) {
            let destinationNode = nodeStore.getState()
                                           .nodes
                                           .find(node => node.nodeId === this.nodeId)

            this.props.onNodeEnter(destinationNode)
        }
    }

    @bind
    onConnectionLeaveDestination() {
        if (nodeStore.getState().isDrawingConnection && nodeStore.getState().shouldConnectNodes) {
            let destinationNode = nodeStore.getState()
                .nodes
                .find(node => node.nodeId === this.nodeId)

            this.props.onNodeLeave(destinationNode)
        }
    }

    render() {
        let translate = `translate(${this.state.dragX}, ${this.state.dragY})`

        return (
            <g transform={translate}>
                <g transform=' translate(110 -15)' class='node-buttons'>
                    <circle cx='0' cy='0' r='14' fill='#ebebeb' stroke='#c8c8c8' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' />
                    <circle cx='0' cy='0' r='10' fill='#ef4836' stroke='none' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' onClick={this.removeNode} />
                </g>
                <rect id='SvgRect' width={this.state.width} height={this.state.height} fill='#ff807f'
                    onMouseDown={this.onMouseDown}
                    onMouseEnter={this.onConnectionEnterDestination}
                    onMouseLeave={this.onConnectionLeaveDestination}
                />
            </g>
        )
    }
}

export default Node
