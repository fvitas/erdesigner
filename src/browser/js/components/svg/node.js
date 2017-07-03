import { h, Component } from 'preact'
import { bind } from 'decko'
import nodeStore from '../../redux/store'
import {ACTION} from '../../redux/actions'
import NODE_TYPE_COMPONENTS from './../../constants/node-type-components'

class Node extends Component {
    constructor({nodeId, nodeName, x, y}) {
        super()

        this.nodeId = nodeId

        this.state = {
            shouldMove: false,
            contentEditable: 'false',
            nodeName: nodeName,
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
        if (nodeStore.getState().settings.shouldConnectNodes) {
            let sourceNode = nodeStore.getState()
                .nodes
                .find(node => node.nodeId === this.nodeId)

            this.props.onDrawConnectionStart(sourceNode)

            nodeStore.dispatch({type: ACTION.START_DRAWING})

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
                contentEditable: 'false',
                dragX: newPositionX,
                dragY: newPositionY
            })

            nodeStore.dispatch({
                type: ACTION.UPDATE_CONNECTIONS,
                value: {
                    nodeId: this.nodeId,
                    x: newPositionX,
                    y: newPositionY,
                    width: this.state.width,
                    height: this.state.height
                }
            })
        }
    }

    @bind
    moveNodeFinished() {
        window.removeEventListener('mousemove', this.moveNode)
        window.removeEventListener('mouseup', this.moveNodeFinished)

        if (this.state.x !== this.state.dragX || this.state.y !== this.state.dragY) {
            nodeStore.dispatch({
                type: ACTION.UPDATE_NODE,
                value: {
                    nodeId: this.nodeId,
                    x: this.state.dragX,
                    y: this.state.dragY,
                    width: this.state.width,
                    height: this.state.height
                }
            })

            this.setState({
                shouldMove: false,
                x: this.state.dragX,
                y: this.state.dragY
            })
        } else {
            this.setState({ shouldMove: false })
        }
    }

    @bind
    removeNode() {
        nodeStore.dispatch({
            type: ACTION.REMOVE_NODE,
            value: {nodeId: this.nodeId}
        })
    }

    @bind
    drawConnection(event) {
        this.props.onDrawConnectionMove(event)
        this.setState({ contentEditable: 'false' })
    }

    @bind
    drawConnectionFinished() {
        window.removeEventListener('mousemove', this.drawConnection)
        window.removeEventListener('mouseup', this.drawConnectionFinished)

        this.props.onDrawConnectionEnd()
        nodeStore.dispatch({type: ACTION.STOP_DRAWING})
    }

    @bind
    onConnectionEnterDestination() {
        if (nodeStore.getState().settings.isDrawingConnection && nodeStore.getState().settings.shouldConnectNodes) {
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
        if (nodeStore.getState().settings.isDrawingConnection && nodeStore.getState().settings.shouldConnectNodes) {
            let destinationNode = nodeStore.getState()
                .nodes
                .find(node => node.nodeId === this.nodeId)

            if (destinationNode) {
                this.props.onNodeLeave(destinationNode)
            }
        }
    }

    componentWillReceiveProps({nodeName, x, y}) {
        if (this.state.nodeName !== nodeName || this.state.x !== x || this.state.y !== y) {
            this.setState({
                ...this.state,
                nodeName: nodeName,
                x: x,
                y: y,
                dragX: x,
                dragY: y
            })
        }
    }

    @bind
    disableEnterKey(e) {
        let pressedKey = e.which
        let ENTER = 13
        if (pressedKey === ENTER) {
            e.preventDefault()
        }
    }

    @bind
    makeNameChange(e) {
        let pressedKey = e.which
        let ENTER = 13
        let ESCAPE = 27

        if (pressedKey === ENTER) {
            this.saveName(e.target.textContent)
        }
        if (pressedKey === ENTER || pressedKey === ESCAPE) {
            this.setState({ contentEditable: 'false' })
        }
    }

    @bind
    enableEdit() {
        this.setState({ contentEditable: 'true' })
    }

    @bind
    onBlur(e) {
        this.saveName(e.target.textContent)
        this.setState({ contentEditable: 'false' })
    }

    saveName(name) {
        if (this.state.nodeName === name) {
            return
        }

        nodeStore.dispatch({
            type: ACTION.NODE_CHANGE_NAME,
            value: {
                nodeId: this.nodeId,
                nodeName: name
            }
        })
    }

    render(props, state) {
        let rootStyle = {
            transform: `translate(${state.dragX}px, ${state.dragY}px)`
        }

        return (
            <div class='canvas-node' style={rootStyle}>
                <div style={{transform: 'translate(110px, -15px)'}} class='node-buttons'>
                    {/* <circle cx='0' cy='0' r='14' fill='#ebebeb' stroke='#c8c8c8' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' /> */}
                    {/* <circle cx='0' cy='0' r='10' fill='#ef4836' stroke='none' style='-webkit-tap-highlight-color: rgba(0, 0, 0, 0);' onClick={this.removeNode} /> */}
                </div>
                <div id='svg-rect' style={{width: state.width, height: state.height, backgroundColor: props.color ? props.color : 'white'}}
                    onMouseDown={this.onMouseDown}
                    onMouseEnter={this.onConnectionEnterDestination}
                    onMouseLeave={this.onConnectionLeaveDestination}
                >

                    { NODE_TYPE_COMPONENTS[props.type] }

                    <div class='node-name' contentEditable={state.contentEditable}
                        onMouseDown={this.enableEdit}
                        onKeyDown={this.disableEnterKey}
                        onKeyUp={this.makeNameChange}
                        onBlur={this.onBlur}
                    >
                        { state.nodeName }
                    </div>
                </div>
            </div>
        )
    }
}

export default Node
