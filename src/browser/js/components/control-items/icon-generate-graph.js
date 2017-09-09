import { h, Component } from 'preact'
import Portal from 'preact-portal'
import {bind} from 'decko'

class IconGenerateGraph extends Component {
    @bind
    open() {
        this.setState({ open: true })
    }

    @bind
    close() {
        this.setState({ open: false })
    }

    @bind
    submit(event) {
        event.preventDefault()

        let vendor = event.target[0].value
        let host = event.target[1].value
        let user = event.target[2].value
        let password = event.target[3].value
        let database = event.target[4].value

        const ipc = require('electron').ipcRenderer
        ipc.send('fetch-from-db', { vendor, host, user, password, database })

        this.close()
    }

    render(props, state) {
        return (
            <div class='icon icon-generate' title='Generate graph from database' onClick={this.open}>

                <svg viewBox='0 0 50 50' width='30' height='30'>
                    <path d='M 25 0 C 19.3545 0 14.239922 1.0161444 10.447266 2.7226562 C 8.5509372 3.5759123 6.978214 4.601147 5.8417969 5.8105469 C 4.7053797 7.0199467 4 8.4567299 4 10 L 4 39 C 4 44.607 13.225 49 25 49 C 29.067 49 32.816 48.465828 36 47.548828 L 36 45.488281 C 32.994 46.418281 29.259 47 25 47 C 13.635 47 6 42.863 6 39 L 6 34.304688 C 9.3220329 37.69823 16.484537 40 25 40 C 27.01 40 28.934719 39.860141 30.761719 39.619141 L 31.392578 38.789062 L 32.511719 37.316406 C 30.256719 37.740406 27.751 38 25 38 C 13.635 38 6 33.863 6 30 L 6 24.337891 C 7.1234422 25.480958 8.6314885 26.460332 10.447266 27.277344 C 14.239922 28.983856 19.3545 30 25 30 C 30.6455 30 35.760078 28.983856 39.552734 27.277344 C 41.368511 26.460332 42.876558 25.480958 44 24.337891 L 44 28.777344 L 46 31.410156 L 46 10 C 46 8.4567299 45.29462 7.0199467 44.158203 5.8105469 C 43.021786 4.601147 41.449062 3.5759123 39.552734 2.7226562 C 35.760078 1.0161444 30.6455 2.9605947e-16 25 0 z M 25 2 C 30.4025 2 35.287078 2.9966369 38.732422 4.546875 C 40.455094 5.3219941 41.811886 6.2353686 42.699219 7.1796875 C 43.586552 8.1240064 44 9.0567701 44 10 C 44 10.94323 43.586552 11.875994 42.699219 12.820312 C 41.811886 13.764632 40.455094 14.678006 38.732422 15.453125 C 35.287078 17.003363 30.4025 18 25 18 C 19.5975 18 14.712922 17.003363 11.267578 15.453125 C 9.5449063 14.678006 8.1881142 13.764632 7.3007812 12.820312 C 6.4134484 11.875995 6 10.94323 6 10 C 6 9.0567701 6.4134485 8.1240064 7.3007812 7.1796875 C 8.1881142 6.2353686 9.5449063 5.3219941 11.267578 4.546875 C 14.712922 2.9966369 19.5975 2 25 2 z M 6 14.337891 C 7.1234422 15.480958 8.6314885 16.460332 10.447266 17.277344 C 14.239922 18.983856 19.3545 20 25 20 C 30.6455 20 35.760078 18.983856 39.552734 17.277344 C 41.368511 16.460332 42.876558 15.480958 44 14.337891 L 44 20 C 44 20.94323 43.586552 21.875994 42.699219 22.820312 C 41.811886 23.764632 40.455094 24.678006 38.732422 25.453125 C 35.287078 27.003363 30.4025 28 25 28 C 19.5975 28 14.712922 27.003363 11.267578 25.453125 C 9.5449063 24.678006 8.1881142 23.764632 7.3007812 22.820312 C 6.4134484 21.875994 6 20.94323 6 20 L 6 14.337891 z M 41.5 28.794922 L 32.984375 40 L 38 40 L 38 50 L 45 50 L 45 40 L 50 40 L 41.5 28.794922 z M 41.5 32.099609 L 45.984375 38 L 43 38 L 43 48 L 40 48 L 40 38 L 37.015625 38 L 41.5 32.099609 z' font-weight='400' font-family='sans-serif' white-space='normal' overflow='visible' />
                </svg>

                {
                    state.open &&
                    <Portal into='body'>
                        <div class='modal'>
                            <form class='modal-form' name='attributeForm' onSubmit={this.submit} style='z-index: 101'>

                                <select name='attributeType'>
                                    <option value='mysql' selected>MySQL</option>
                                </select>

                                <input type='text' name='host' onChange={this.preventDefault} value='localhost' placeholder='host' />
                                <input type='text' name='user' onChange={this.preventDefault} value='root' placeholder='user' />
                                <input type='text' name='password' onChange={this.preventDefault} value='root' placeholder='password' />
                                <input type='text' name='database' onChange={this.preventDefault} value='tutorial_database' placeholder='database' />

                                <div style='text-align: right;    margin: 30px 5px 0px;'>
                                    <input type='submit' value='Submit' />
                                    <input type='button' value='Cancel' onClick={this.close} />
                                </div>
                            </form>

                            <div class='modal-mask' />
                        </div>
                    </Portal>
                }

            </div>
        )
    }
}

export { IconGenerateGraph }
