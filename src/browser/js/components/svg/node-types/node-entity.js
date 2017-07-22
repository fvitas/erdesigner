import { h } from 'preact'

export default function NodeEntity({width = 100, height = 50, color = 'white'}) {
    return (
        <svg width={`${width}`} height={`${height}`}>
            <polygon points={`0,0 0,${height} ${width},${height} ${width},0`} style={{fill: color, stroke: 'black', strokeWidth: '2px'}} />
        </svg>
    )
}
