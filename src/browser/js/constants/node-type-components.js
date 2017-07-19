import { h } from 'preact'

import NODE_TYPE from './node-type'

import Entity from './../components/svg/node-types/node-entity'
import Attribute from './../components/svg/node-types/node-attribute'
import AssociativeEntity from './../components/svg/node-types/node-associative-entity'
import Relationship from './../components/svg/node-types/node-relationship'
import WeakEntity from './../components/svg/node-types/node-weak-entity'
import Inheritance from './../components/svg/node-types/node-inheritance'

function getNodeTypeComponent(type, props) {
    // TODO filipv: refactor this shit somehow => dynamic props (because of color)
    return {
        [NODE_TYPE.ENTITY]: <Entity {...props} />,
        [NODE_TYPE.ATTRIBUTE]: <Attribute {...props} />,
        [NODE_TYPE.ASSOCIATIVE_ENTITY]: <AssociativeEntity {...props} />,
        [NODE_TYPE.RELATIONSHIP]: <Relationship {...props} />,
        [NODE_TYPE.WEAK_ENTITY]: <WeakEntity {...props} />,
        [NODE_TYPE.INHERITANCE]: <Inheritance {...props} />
    }[type]
}

export default getNodeTypeComponent
