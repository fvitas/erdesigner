/* eslint-disable one-var */
'use strict'

import { h, Component } from 'preact'
import { bind } from 'decko'

import NodePicker from './node-picker'
import Node from './svg/node'

import nodeStore from './../stores/node-store'

class AppCanvas extends Component {
    componentWillMount () {
        this.updateCanvasDimensions()
    }

    componentDidMount () {
        window.addEventListener('resize', this.updateCanvasDimensions)
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.updateCanvasDimensions)
    }

    @bind
    updateCanvasDimensions () {
        this.setState({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    }

    render () {
        this.setState({ nodes: nodeStore.getState() })

        return (
            <div>
                <NodePicker />

                <svg id='SvgjsSvg1001' width={this.state.canvasWidth} height={this.state.canvasHeight} xmlns='http://www.w3.org/2000/svg' version='1.1'
                    onDragOver={event => event.preventDefault()}
                >
                    <defs id='SvgjsDefs1002' />

                    {
                        this.state.nodes.map((value, index) => (
                            <Node
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
