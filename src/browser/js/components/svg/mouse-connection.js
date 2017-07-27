import { h, Component } from 'preact'
import _ from 'lodash'
import nodeStore from './../../redux/store'

class MouseConnection extends Component {
    render({source, destination, zoom}) {
        if (!source || !destination) {
            return null
        }

        let strokeWidth = zoom
        let sourceNode = _.find(nodeStore.getState().nodes, { nodeId: source.nodeId })

        let x1 = source.x + sourceNode.width / 2
        let y1 = source.y + sourceNode.height / 2
        let x2
        let y2

        if (destination.nodeId) {
            let destinationNode = _.find(nodeStore.getState().nodes, { nodeId: destination.nodeId })
            x2 = destination.x + destinationNode.width / 2
            y2 = destination.y + destinationNode.height / 2
        } else {
            x2 = destination.x
            y2 = destination.y
        }

        let translate = `translate(${x1}, ${y1})`

        return (
            <g transform={translate} >
                <line class='node-connection' x1='0' y1='0' x2={x2 - x1} y2={y2 - y1} stroke-width={strokeWidth} stroke='black' />
            </g>
        )
    }
}

export default MouseConnection
