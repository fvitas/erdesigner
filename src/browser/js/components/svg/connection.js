import { h, Component } from 'preact'

class Connection extends Component {
    render(props) {
        let {x1, y1, x2, y2} = props
        let translate = `translate(${x1}, ${y1})`
        let storkeWidth = props.zoom

        return (
            <g transform={translate} >
                {/* <text x={(x2 - x1) / 3} y={(y2 - y1) / 3}>0</text> */}

                <line class='node-connection' x1='0' y1='0' x2={x2 - x1} y2={y2 - y1} stroke-width={storkeWidth} stroke='black' onClick={() => { console.log('click on line') }} />

                {/* <text x={(x2 - x1) * 2 / 3} y={(y2 - y1) * 2 / 3}>0</text> */}
            </g>
        )
    }
}

export default Connection
