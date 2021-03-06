import { h } from 'preact'

const IconDelete = ({ ...props }) => (
    <div class='icon icon-delete' title='Delete Selected Node' onClick={props.onClick}>
        <svg viewBox='0 0 25 25' width='30' height='30'>
            <path d='M16 19h-1v-9h1zm9-15v1h-3v18.8a1.3 1.3 0 0 1-1.3 1.2H4.4A1.3 1.3 0 0 1 3 23.7V5H0V4h8V1.2A1.3 1.3 0 0 1 9.3 0h6.4A1.3 1.3 0 0 1 17 1.3V4zM9 4h7V1.2a.3.3 0 0 0-.3-.2H9.3a.3.3 0 0 0-.3.3zm12 1H4v18.8a.3.3 0 0 0 .3.2h16.4a.3.3 0 0 0 .3-.3zm-11 5H9v9h1z' fill='#0e1d25' />
        </svg>
    </div>
)

export { IconDelete }
