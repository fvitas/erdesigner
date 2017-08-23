import { h, Component } from 'preact'
import { bind } from 'decko'
import _ from 'lodash'
import { connect } from 'preact-redux'

import Node from './svg/node'
import Connection from './svg/connection'
import MouseConnection from './svg/mouse-connection'

import { ACTION } from '../redux/actions'

import NODE_COLORS from './../constants/node-colors'
import NODE_COMPATIBILITY from './../constants/node-compatibility'

@connect(
    state => ({ nodes: state.nodes, connections: state.connections, settings: state.settings })
)
class ERDiagramCanvas extends Component {
    componentWillMount() {
        this.updateCanvasDimensions()
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateCanvasDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCanvasDimensions)
    }

    @bind
    updateCanvasDimensions() {
        this.setState({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    }

    @bind
    drawConnectionStart(sourceNode) {
        this.setState({
            temporaryConnection: {
                source: {
                    nodeId: sourceNode.nodeId,
                    type: sourceNode.type,
                    x: sourceNode.x,
                    y: sourceNode.y
                }
            }
        })

        this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: sourceNode.nodeId, color: NODE_COLORS.GREEN}})
    }

    @bind
    drawConnection(mouseDestination) {
        let temporaryConnection = {
            source: this.state.temporaryConnection.source
        }

        if (this.state.temporaryConnection.destination && this.state.temporaryConnection.destination.nodeId) {
            temporaryConnection.destination = this.state.temporaryConnection.destination
        } else {
            temporaryConnection.destination = {
                x: mouseDestination.clientX,
                y: mouseDestination.clientY
            }
        }

        this.setState({ temporaryConnection: temporaryConnection })
    }

    @bind
    addConnectionDestination(destinationNode) {
        if (!this.state.temporaryConnection || !destinationNode) {
            return
        }

        let sourceNode = this.state.temporaryConnection.source

        if (sourceNode && sourceNode.nodeId !== destinationNode.nodeId) {
            this.setState({
                temporaryConnection: {
                    source: sourceNode,
                    destination: {
                        nodeId: destinationNode.nodeId,
                        type: destinationNode.type,
                        x: destinationNode.x,
                        y: destinationNode.y
                    }
                }
            })

            // set color to destination
            if (this.destinationIsCompatible(sourceNode, destinationNode)) {
                this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: destinationNode.nodeId, color: NODE_COLORS.GREEN}})
            } else {
                this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: destinationNode.nodeId, color: NODE_COLORS.RED}})
            }
        }
    }

    @bind
    removeConnectionDestination(destinationNode) {
        if (!!this.state.temporaryConnection.destination && this.state.temporaryConnection.destination.nodeId === destinationNode.nodeId) {
            this.setState({
                temporaryConnection: {
                    source: this.state.temporaryConnection.source,
                    destination: null
                }
            })

            // remove color from node
            this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: destinationNode.nodeId, color: undefined}})
        }
    }

    @bind
    drawConnectionEnd() {
        let sourceNode = this.state.temporaryConnection.source
        let destinationNode = this.state.temporaryConnection.destination

        // reset colors
        this.props.dispatch({type: ACTION.NODE_REMOVE_COLOR})

        if (
            !sourceNode ||
            !destinationNode ||
            (destinationNode && !destinationNode.nodeId) ||
            !this.destinationIsCompatible(sourceNode, destinationNode) ||
            this.connectionExist(sourceNode, destinationNode)
        ) {
            this.setState({temporaryConnection: null})
            return
        }

        let connection = {
            source: {
                nodeId: sourceNode.nodeId,
                x: sourceNode.x,
                y: sourceNode.y
            },
            destination: {
                nodeId: destinationNode.nodeId,
                x: destinationNode.x,
                y: destinationNode.y
            }
        }

        this.props.dispatch({
            type: ACTION.ADD_CONNECTION,
            value: {...connection}
        })

        this.setState({temporaryConnection: null})
    }

    connectionExist(source, destination) {
        return _.some(this.props.connections, connection => connection.sourceNodeId === source.nodeId && connection.destinationNodeId === destination.nodeId)
    }

    destinationIsCompatible(source, destination) {
        return _.includes(NODE_COMPATIBILITY[source.type], destination.type)
    }

    @bind
    zoomOnScroll(event) {
        if (event.wheelDelta < 0) {
            this.props.dispatch({type: ACTION.ZOOM_IN})
        } else {
            this.props.dispatch({type: ACTION.ZOOM_OUT})
        }
    }

    @bind
    onCanvasMouseDown(event) {
        this.props.dispatch({type: ACTION.NODE_DESELECT})

        this.prevX = event.clientX
        this.prevY = event.clientY
        this.dragging = true

        window.addEventListener('mousemove', this.onCanvasMouseMove)
        window.addEventListener('mouseup', this.onCanvasMouseUp)
    }

    @bind
    onCanvasMouseMove(event) {
        this.props.dispatch({
            type: ACTION.MOVE_CANVAS,
            value: {
                x: event.clientX - this.prevX,
                y: event.clientY - this.prevY
            }
        })

        this.prevX = event.clientX
        this.prevY = event.clientY
    }

    @bind
    onCanvasMouseUp() {
        this.props.dispatch({
            type: ACTION.MOVE_CANVAS,
            value: { x: 0, y: 0 }
        })

        this.dragging = false

        window.removeEventListener('mousemove', this.onCanvasMouseMove)
        window.removeEventListener('mouseup', this.onCanvasMouseUp)
    }

    render(props) {
        let cursorStyle = { cursor: this.dragging ? '-webkit-grabbing' : '-webkit-grab' }

        return (
            <div>
                <svg id='canvas' width={this.state.canvasWidth} height={this.state.canvasHeight}
                    onMouseDown={this.onCanvasMouseDown}
                    onWheel={_.throttle(this.zoomOnScroll, 250)} // problem with resizing after zoom
                    style={cursorStyle}
                >
                    { props.connections.map(connection => <Connection {...connection} zoom={props.settings.zoom} />) }

                    { this.state.temporaryConnection && <MouseConnection {...this.state.temporaryConnection} zoom={props.settings.zoom} /> }
                </svg>

                {
                    props.nodes.map(value => (
                        <Node key={value.nodeId} {...value}
                            zoom={props.settings.zoom}
                            onDrawConnectionStart={this.drawConnectionStart}
                            onDrawConnectionMove={this.drawConnection}
                            onDrawConnectionEnd={this.drawConnectionEnd}
                            onNodeEnter={this.addConnectionDestination}
                            onNodeLeave={this.removeConnectionDestination}
                        />
                    ))
                }
            </div>
        )
    }
}

export default ERDiagramCanvas
