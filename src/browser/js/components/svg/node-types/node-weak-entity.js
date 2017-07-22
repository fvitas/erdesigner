import { h } from 'preact'

export default function NodeWeakEntity({width = 100, height = 50, color = 'white'}) {
    return (
        <svg width={`${width}`} height={`${height}`}>
            <polygon points={`0,0 0,${height} ${width},${height} ${width},0`} style={{fill: color, stroke: 'black', strokeWidth: '2px'}} />
            <polygon points={`3,3 3,${height - 3} ${width - 3},${height - 3} ${width - 3},3`} style={{fill: color, stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}
