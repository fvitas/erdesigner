import { h } from 'preact'

export default function NodeRelationship({width = 100, height = 50, color = 'white'}) {
    return (
        <svg width={`${width}`} height={`${height}`}>
            <polygon points={`${width / 2},1 ${width - 1},${height / 2} ${width / 2},${height - 1} 1,${height / 2}`} style={{fill: color, stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}
