import { h } from 'preact'

export default function NodeInheritance({color}) {
    return (
        <svg width='100' height='50'>
            <polygon points='15,49 85,49 50,1' style={{fill: color || 'white', stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}
