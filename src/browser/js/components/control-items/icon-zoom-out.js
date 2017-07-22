import { h } from 'preact'

const IconZoomOut = ({ ...props }) => (
    <div class='icon icon-zoom-out' title='Zoom Out' onClick={props.onClick}>
        <svg viewBox='0 0 50 50' width='30' height='30'>
            <path d='M21 3C11.62 3 4 10.62 4 20c0 9.38 7.62 17 17 17 3.71 0 7.14-1.195 9.938-3.22l13.156 13.126 2.812-2.812-13-13.032C36.46 28.087 38 24.223 38 20c0-9.38-7.62-17-17-17zm0 2c8.297 0 15 6.703 15 15s-6.703 15-15 15S6 28.297 6 20 12.703 5 21 5zm-8 14v2h16v-2z' />
        </svg>
    </div>
)

export { IconZoomOut }
