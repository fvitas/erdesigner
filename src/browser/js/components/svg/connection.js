import { h } from 'preact'

const Connection = ({ children, ...props }) => (
    <line class='node-connection' {...props} stroke-width='2' stroke='black' >{ children }</line>
)

export default Connection
