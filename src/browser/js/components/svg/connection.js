import { h, Component } from 'preact'
import _ from 'lodash'
import nodeStore from './../../redux/store'

class Connection extends Component {
    render({source, destination, zoom}) {
        if (!source || !destination) {
            return null
        }

        let strokeWidth = zoom
        let sourceNode = _.find(nodeStore.getState().nodes, { nodeId: source.nodeId })
        let destinationNode = _.find(nodeStore.getState().nodes, { nodeId: destination.nodeId })

        let x1 = source.x + sourceNode.width / 2
        let y1 = source.y + sourceNode.height / 2
        let x2 = destination.x + destinationNode.width / 2
        let y2 = destination.y + destinationNode.height / 2

        let translate = `translate(${x1}, ${y1})`

        // let d = `M${x1},${y1} C${x1 + 100},${y1} ${x2 - 100},${y2} ${x2},${y2}`
        // return (
        //     stroke: #000;
        //     stroke-width: 2px;
        //     stroke-linecap: round;
        //     fill: none;
        //     <path id='curve' d={d} />
        // )
        return (
            <g transform={translate} >
                <line class='node-connection' x1='0' y1='0' x2={x2 - x1} y2={y2 - y1} stroke-width={strokeWidth} stroke='black' onClick={() => { console.log('click on line') }} />
            </g>
        )
    }
}

export default Connection
