import { h } from 'preact'

export default function NodeAttribute({color}) {
    return (
        <svg width='100' height='50'>
            <ellipse cx='50' cy='25' rx='49' ry='24' style={{fill: color || 'white', stroke: 'black'}} />
        </svg>
    )
}
