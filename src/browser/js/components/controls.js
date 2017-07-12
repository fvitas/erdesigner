import { h, Component } from 'preact'
import {ACTION} from '../redux/actions'
import { connect } from 'preact-redux'

import {IconTrash} from './control-items/icon-trash'
// import {IconLink} from './control-items/icon-link'
import {IconZoomIn} from './control-items/icon-zoom-in'
import {IconZoomOut} from './control-items/icon-zoom-out'
import {IconZoomCustom} from './control-items/icon-zoom-custom'
import {IconUndo} from './control-items/icon-undo'
import {IconRedo} from './control-items/icon-redo'
import {IconSelect} from './control-items/icon-select-connect'
import {IconToFront} from './control-items/icon-to-front'
import {IconToBack} from './control-items/icon-to-back'
import {IconExport} from './control-items/icon-export'
import {IconImport} from './control-items/icon-import'
import {IconGenerateSQL} from './control-items/icon-generate-sql'
import {IconOpenTool} from './control-items/icon-open-tool'

@connect()
class Controls extends Component {
    render(props) {
        return (
            <div class='controls'>

                <IconZoomCustom />

                <div class='separator' />

                <IconZoomIn />
                <IconZoomOut />

                <div class='separator' />

                <IconUndo />
                <IconRedo />

                <div class='separator' />

                <IconSelect />

                <div class='separator' />

                <IconTrash onClick={() => props.dispatch({type: ACTION.REMOVE_ALL_NODE})} />

                <div class='separator' />

                <IconToFront />
                <IconToBack />

                <div class='separator' />

                <IconImport />
                <IconExport />

                <div class='separator' />

                <IconGenerateSQL />
                <IconOpenTool />
            </div>
        )
    }
}

export default Controls
