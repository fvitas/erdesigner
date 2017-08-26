import { h, Component } from 'preact'
import { bind } from 'decko'
import _ from 'lodash'
// import nodeStore from '../../redux/store'
// import {ACTION} from '../../redux/actions'

class Attributes extends Component {
    @bind
    onAttributeDelete() {}

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
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default Attributes
