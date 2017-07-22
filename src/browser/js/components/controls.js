import { h, Component } from 'preact'
import _ from 'lodash'
import nodeStore from './../redux/store'
import { ACTION } from '../redux/actions'
import { connect } from 'preact-redux'
import { bind } from 'decko'

import { IconTrash } from './control-items/icon-trash'
import { IconZoomIn } from './control-items/icon-zoom-in'
import { IconZoomOut } from './control-items/icon-zoom-out'
// import { IconZoomCustom } from './control-items/icon-zoom-custom'
import { IconUndo } from './control-items/icon-undo'
import { IconRedo } from './control-items/icon-redo'
import { IconSelect } from './control-items/icon-select'
import { IconConnect } from './control-items/icon-connect'
import { IconToFront } from './control-items/icon-to-front'
import { IconToBack } from './control-items/icon-to-back'
import { IconExport } from './control-items/icon-export'
import { IconImport } from './control-items/icon-import'
import { IconGenerateSQL } from './control-items/icon-generate-sql'
import { IconOpenTool } from './control-items/icon-open-tool'

@connect()
class Controls extends Component {
    @bind
    zoomIn() {
        this.props.dispatch({type: ACTION.ZOOM_IN})
    }

    @bind
    zoomOut() {
        this.props.dispatch({type: ACTION.ZOOM_OUT})
    }

    @bind
    undo() {
        this.props.dispatch({type: ACTION.UNDO})
    }

    @bind
    redo() {
        this.props.dispatch({type: ACTION.REDO})
    }

    @bind
    selectNodes() {
        this.props.dispatch({type: ACTION.SELECT_NODE})
    }

    @bind
    connectNodes() {
        this.props.dispatch({type: ACTION.CONNECT_NODE})
    }

    @bind
    deleteAllNodes() {
        this.props.dispatch({type: ACTION.REMOVE_ALL_NODE})
    }

    @bind
    toFront() {
        nodeStore.dispatch({ type: ACTION.NODE_TO_FRONT })
    }

    @bind
    toBack() {
        nodeStore.dispatch({ type: ACTION.NODE_TO_BACK })
    }

    @bind
    importDiagram() {
        let fs = require('fs')
        let { dialog } = require('electron').remote

        dialog.showOpenDialog(filePaths => {
            if (_.isEmpty(filePaths) || _.size(filePaths) > 1) {
                return
            }

            let file = filePaths[0]
            let importedData = JSON.parse(fs.readFileSync(file, 'utf8'))

            nodeStore.dispatch({
                type: ACTION.IMPORT,
                value: importedData
            })
        })
    }

    @bind
    exportDiagram() {
        let fs = require('fs')
        let { dialog } = require('electron').remote

        dialog.showSaveDialog(fileName => {
            if (!fileName) {
                return
            }

            let jsonData = JSON.stringify(nodeStore.getState())

            fs.writeFile(fileName + '.json', jsonData, err => {
                if (err) {
                    console.error(err)
                }
            })
        })
    }

    @bind
    generateSQL() {
        console.log('tbd')
    }

    @bind
    openSideTool() {
        console.log('tbd')
    }

    render() {
        return (
            <div class='controls'>

                {/* <IconZoomCustom /> */}
                {/* <div class='separator' /> */}

                <IconZoomIn onClick={this.zoomIn} />
                <IconZoomOut onClick={this.zoomOut} />

                <div class='separator' />

                <IconUndo onClick={this.undo} />
                <IconRedo onClick={this.redo} />

                <div class='separator' />

                <IconSelect onClick={this.selectNodes} />
                <IconConnect onClick={this.connectNodes} />

                <div class='separator' />

                <IconTrash onClick={this.deleteAllNodes} />

                <div class='separator' />

                <IconToFront onClick={this.toFront} />
                <IconToBack onClick={this.toBack} />

                <div class='separator' />

                <IconImport onClick={this.importDiagram} />
                <IconExport onClick={this.exportDiagram} />

                <div class='separator' />

                <IconGenerateSQL onClick={this.generateSQL} />
                <IconOpenTool onClick={this.openSideTool} />
            </div>
        )
    }
}

export default Controls
