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
            window.addEventListener('mouseup', this.moveNodeFinished)
        }
    }

    @bind
    moveNode(event) {
        if (this.state.shouldMove) {
            let newPositionX = this.state.x + event.clientX - this.state.startDragX
            let newPositionY = this.state.y + event.clientY - this.state.startDragY

            this.setState({
                dragX: newPositionX,
                dragY: newPositionY
            })

            let allNodeConnections = [...nodeStore.getState().connections]

            allNodeConnections.forEach(connection => {
                if (connection.sourceNodeId === this.nodeId) {
                    connection.x1 = newPositionX + this.state.width / 2
                    connection.y1 = newPositionY + this.state.height / 2
                }
                if (connection.destinationNodeId === this.nodeId) {
                    connection.x2 = newPositionX + this.state.width / 2
                    connection.y2 = newPositionY + this.state.height / 2
                }
            })

            nodeStore.dispatch({
                type: 'UPDATE_CONNECTIONS',
                value: allNodeConnections
            })
        }
    }

    @bind
    moveNodeFinished() {
        window.removeEventListener('mousemove', this.moveNode)
        window.removeEventListener('mouseup', this.moveNodeFinished)

        this.setState({
            shouldMove: false,
            x: this.state.dragX,
            y: this.state.dragY
        })

        let node = nodeStore.getState()
            .nodes
            .find(node => node.nodeId === this.nodeId)

        nodeStore.dispatch({
            type: 'UPDATE_NODE',
            value: {
                ...node,
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

            if (destinationNode) {
                this.props.onNodeEnter(destinationNode)
            }
        }
    }

    @bind
    onConnectionLeaveDestination() {
        if (nodeStore.getState().isDrawingConnection && nodeStore.getState().shouldConnectNodes) {
            let destinationNode = nodeStore.getState()
                .nodes
                .find(node => node.nodeId === this.nodeId)

            if (destinationNode) {
                this.props.onNodeLeave(destinationNode)
            }
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
