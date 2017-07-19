import { h, Component } from 'preact'

class Connection extends Component {
    render(props) {
        let {x1, y1, x2, y2} = props
        let translate = `translate(${x1}, ${y1})`
        let storkeWidth = props.zoom

        // let d = `M${x1},${y1} C${x1 + 100},${y1} ${x2 - 100},${y2} ${x2},${y2}`
        // <path id='curve' d={d} />

        return (
            <g transform={translate} >
                <line class='node-connection' x1='0' y1='0' x2={x2 - x1} y2={y2 - y1} stroke-width={storkeWidth} stroke='black' onClick={() => { console.log('click on line') }} />
            </g>
        )
    }
}

export default Connection
