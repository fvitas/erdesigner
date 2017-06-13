import { h, Component } from 'preact'
import { bind } from 'decko'

import { IconLink } from './svg/icon-link'

class NodeConnector extends Component {
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    @bind
    connectNodes(event) {
        console.log(event)
        // make cursor crosshair
    }

    render() {
        return (
            <div>
                <IconLink onClick={this.connectNodes} />
                <span class='icon-text'>Connect</span>
            </div>
        )
    }
}

export { NodeConnector }
