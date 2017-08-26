import { h, Component } from 'preact'
import { bind } from 'decko'
import _ from 'lodash'
import nodeStore from '../../redux/store'
import {ACTION} from '../../redux/actions'

class Attributes extends Component {
    @bind
    onAttributeDelete(attributeName) {
        nodeStore.dispatch({
            type: ACTION.DELETE_ATTRIBUTE,
            value: {
                nodeId: this.props.nodeId,
                attributeName: attributeName
            }
        })
    }

    render(props) {
        if (_.isEmpty(props.attributes)) {
            return null
        }

        return (
            <div>
                {
                    props.attributes.map(attribute => (
                        <div class='node-attribute'>
                            <span class={attribute.isPrimary ? 'primary-key' : ''}>{attribute.name}</span>
                            <svg class='delete-attribute' onClick={this.onAttributeDelete.bind(this, attribute.name)}>
                                <circle cx='10' cy='10' r='9' fill='white' stroke='black' />
                                <polyline points='5 15, 15 5' stroke='black' />
                                <polyline points='15 15, 5 5' stroke='black' />
                            </svg>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default Attributes
