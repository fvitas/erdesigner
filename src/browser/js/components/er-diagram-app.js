import { h, Component } from 'preact'
import { bind } from 'decko'

import NodePicker from './node-picker'
import { IconTrash } from './svg/icon-trash'

import ERDiagramCanvas from './er-diagram-canvas'

class ERDiagramApp extends Component {
    componentDidMount() {
        this.setState({
            shouldClose: false,
            width: 180
        })
    }

    @bind
    onMouseDown(event) {
        let clientX = event.clientX

        this.setState({
            startClientX: clientX
        })

        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
    }

    @bind
    onMouseMove(event) {
        let clientX = event.clientX

        clientX = this.adjustMousePosition(clientX)

        this.setState({
            shouldClose: false,
            width: clientX
        })
    }

    @bind
    onMouseUp(event) {
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)

        let clientX = event.clientX

        if (this.state.startClientX === clientX) {
            // clicked
            this.setState({
                shouldClose: !this.state.shouldClose
            })
        } else {
            // moved
            clientX = this.adjustMousePosition(clientX)

            this.setState({
                width: clientX
            })
        }
    }

    adjustMousePosition(position) {
        if (position < 0) {
            return 0
        }

        let resizerWidth = 10

        if (position > window.innerWidth - resizerWidth) {
            return window.innerWidth - resizerWidth
        }

        return position
    }

    render(props, state) {
        let paneWidth = state.shouldClose ? 0 : state.width

        return (
            <div id='er-diagram-app' style='width: 100vw; height: 100vh;'>

                <header>
                    <div class='controls'>
                        <IconTrash onClick />
                    </div>
                </header>

                <div class='pane-split'>

                    <div class='pane pane-1' style={{width: paneWidth}}>
                        <NodePicker />
                    </div>

                    <div class='resizer' title='Collapse/Expand' onMouseDown={this.onMouseDown} />

                    <div class='pane pane-2'>
                        <ERDiagramCanvas />
                    </div>
                </div>

            </div>
        )
    }
}

export default ERDiagramApp
