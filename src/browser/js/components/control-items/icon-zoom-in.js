import { h } from 'preact'

const IconZoomIn = () => (
    <div class='icon icon-zoom-in' title='Zoom In'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='30' height='30'>
            <path d='M21 3C11.623 3 4 10.623 4 20c0 9.377 7.623 17 17 17 3.71 0 7.14-1.196 9.938-3.22l13.156 13.126 2.812-2.812-13-13.032C36.46 28.088 38 24.223 38 20c0-9.377-7.623-17-17-17zm0 2c8.296 0 15 6.704 15 15s-6.704 15-15 15S6 28.296 6 20 12.704 5 21 5zm-1 7v7h-7v2h7v7h2v-7h7v-2h-7v-7h-2z' />
        </svg>
        <div>Zoom In</div>
    </div>
)

export { IconZoomIn }
