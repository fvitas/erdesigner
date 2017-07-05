import { h } from 'preact'

export default function NodeEntity({color}) {
    return (
        <svg width='100' height='50'>
            <polygon points='0,0 0,50 100,50 100,0' style={{fill: color || 'white', stroke: 'black', strokeWidth: '2px'}} />
        </svg>
    )
}
