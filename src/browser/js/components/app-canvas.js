'use strict'

import { h, Component } from 'preact'
import { createStore } from 'redux'

import NodePicker from './node-picker'
import SvgRect from './svg/svg-rect'
import nodeReducer from '../reducers/node-reducer'

const store = createStore(nodeReducer)

class AppCanvas extends Component {
    render () {
        this.setState({ nodes: store.getState() })

        return (
            <div>
                <NodePicker store={store} />

                <svg id='SvgjsSvg1001' width='500' height='500' xmlns='http://www.w3.org/2000/svg' version='1.1'
                    onDragOver={event => event.preventDefault()}
                >
                    <defs id='SvgjsDefs1002' />

                    {
                        this.state.nodes.map((value, index) => (
                            <SvgRect
                                key={index}
                                x={value.x}
                                y={value.y}
                            />
                        ))
                    }
                </svg>
            </div>
        )
    }
}

export default AppCanvas
