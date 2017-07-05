import { h } from 'preact'

export default function NodeWeakEntity({color}) {
    return (
        <svg width='100' height='50'>
            <polygon points='0,0 0,50 100,50 100,0' style={{fill: color || 'white', stroke: 'black', strokeWidth: '2px'}} />
            <polygon points='3,3 3,47 97,47 97,3' style={{fill: color || 'white', stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}
