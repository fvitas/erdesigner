import { h } from 'preact'

export default function NodeAssociativeEntity() {
    return (
        <svg width='100' height='50'>
            <polygon points='0,0 0,50 100,50 100,0' style='fill:transparent; stroke:black; stroke-width:2px' />
            <polygon points='50,1 99,25 50,49 1,25' style='fill:transparent; stroke:black; stroke-width:1px' />
        </svg>
    )
}
