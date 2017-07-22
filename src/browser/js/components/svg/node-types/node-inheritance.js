import { h } from 'preact'

export default function NodeInheritance({width = 100, height = 50, color = 'white'}) {
    return (
        <svg width={`${width}`} height={`${height}`}>
            <polygon points={`${width / 5},${height - 1} ${width - width / 5},${height - 1} ${width / 2},1`} style={{fill: color, stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}
