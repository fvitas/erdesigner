import { h } from 'preact'

export default function NodeAttribute({width = 100, height = 50, color = 'white'}) {
    return (
        <svg width={`${width}`} height={`${height}`}>
            <ellipse cx={`${width / 2}`} cy={`${height / 2}`} rx={`${width / 2 - 1}`} ry={`${height / 2 - 1}`} style={{fill: color, stroke: 'black'}} />
        </svg>
    )
}
