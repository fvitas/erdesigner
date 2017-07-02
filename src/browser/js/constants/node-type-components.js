import { h } from 'preact'

import NODE_TYPE from './node-type'

import Entity from './../components/svg/node-types/node-entity'
import Attribute from './../components/svg/node-types/node-attribute'
import AssociativeEntity from './../components/svg/node-types/node-associative-entity'
import Relationship from './../components/svg/node-types/node-relationship'
import WeakEntity from './../components/svg/node-types/node-weak-entity'

const NODE_TYPE_COMPONENTS = {
    [NODE_TYPE.ENTITY]: <Entity />,
    [NODE_TYPE.ATTRIBUTE]: <Attribute />,
    [NODE_TYPE.ASSOCIATIVE_ENTITY]: <AssociativeEntity />,
    [NODE_TYPE.RELATIONSHIP]: <Relationship />,
    [NODE_TYPE.WEAK_ENTITY]: <WeakEntity />
}

export default NODE_TYPE_COMPONENTS
