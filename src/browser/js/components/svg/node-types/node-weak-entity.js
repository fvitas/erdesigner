import { h } from 'preact'

export default function NodeWeakEntity() {
    return (
        <svg width='100' height='50'>
            <polygon points='0,0 0,50 100,50 100,0' style='fill:transparent; stroke:black; stroke-width: 2px;' />
            <polygon points='3,3 3,47 97,47 97,3' style='fill:transparent; stroke:black; stroke-width: 1px;' />
        </svg>
    )
}
