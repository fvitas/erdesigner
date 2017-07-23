import { h, Component } from 'preact'
import { bind } from 'decko'
import _ from 'lodash'
import { connect } from 'preact-redux'

import Node from './svg/node'
import Connection from './svg/connection'

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
        let x = sourceNode.x + sourceNode.width / 2
        let y = sourceNode.y + sourceNode.height / 2

        this.setState({ temporaryConnection: {source: {nodeId: sourceNode.nodeId, type: sourceNode.type, x, y}} })

        this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: sourceNode.nodeId, color: NODE_COLORS.GREEN}})
    }

    @bind
    drawConnection(mouseDestination) {
        let line = {}
        line.x1 = this.state.temporaryConnection.source.x
        line.y1 = this.state.temporaryConnection.source.y

        if (this.state.temporaryConnection.destination) {
            line.x2 = this.state.temporaryConnection.destination.x
            line.y2 = this.state.temporaryConnection.destination.y
        } else {
            line.x2 = mouseDestination.clientX
            line.y2 = mouseDestination.clientY
        }

        this.setState({temporaryConnectionLine: line})
    }

    @bind
    addConnectionDestination(destinationNode) {
        let sourceNode = this.state.temporaryConnection.source

        if (sourceNode && sourceNode.nodeId !== destinationNode.nodeId) {
            let x = destinationNode.x + destinationNode.width / 2
            let y = destinationNode.y + destinationNode.height / 2

            this.setState({ temporaryConnection: {
                source: sourceNode,
                destination: {nodeId: destinationNode.nodeId, type: destinationNode.type, x, y}
            }})

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
            this.setState({ temporaryConnection: {
                source: this.state.temporaryConnection.source,
                destination: null
            }})

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
            !this.destinationIsCompatible(sourceNode, destinationNode) ||
            this.connectionExist(sourceNode, destinationNode)
        ) {
            this.setState({temporaryConnection: null, temporaryConnectionLine: null})
            return
        }

        let connection = {
            sourceNodeId: sourceNode.nodeId,
            destinationNodeId: destinationNode.nodeId,
            x1: sourceNode.x,
            y1: sourceNode.y,
            x2: destinationNode.x,
            y2: destinationNode.y
        }

        this.props.dispatch({
            type: ACTION.ADD_CONNECTION,
            value: {...connection}
        })

        this.setState({temporaryConnection: null, temporaryConnectionLine: null})
    }

    connectionExist(source, destination) {
        return _.some(this.props.connections, connection => connection.sourceNodeId === source.nodeId && connection.destinationNodeId === destination.nodeId)
    }

    destinationIsCompatible(source, destination) {
        return _.includes(NODE_COMPATIBILITY[source.type], destination.type)
    }

    @bind
    zoomOnScroll(event) {
        if (event.wheelDelta > 0) {
            this.props.dispatch({type: ACTION.ZOOM_IN})
        } else {
            this.props.dispatch({type: ACTION.ZOOM_OUT})
        }
    }

    render(props) {
        return (
            <div>
                <svg id='canvas' width={this.state.canvasWidth} height={this.state.canvasHeight}
                    onDragOver={event => event.preventDefault()}
                    onMouseDown={() => props.dispatch({type: ACTION.NODE_DESELECT})}
                    onWheel={_.throttle(this.zoomOnScroll, 250)} // problem with resizing after zoom
                >
                    <defs id='svg-defs' />

                    { props.connections.map(connection => <Connection {...connection} zoom={props.settings.zoom} />) }

                    { this.state.temporaryConnectionLine && <Connection {...this.state.temporaryConnectionLine} zoom={props.settings.zoom} /> }
                </svg>

                <div>
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
            </div>
        )
    }
}

export default ERDiagramCanvas
