'use strict'

import { h, Component } from 'preact'
import NodePicker from './node-picker'
import SvgRect from './svg/svg-rect'

class AppCanvas extends Component {
    render () {
        return (
            <div>
                <NodePicker />
                <svg id='SvgjsSvg1001' width='500' height='500'
                    xmlns='http://www.w3.org/2000/svg' version='1.1'>
                    <defs id='SvgjsDefs1002' />

                    <SvgRect />
                </svg>
            </div>
        )
    }
}

export default AppCanvas
