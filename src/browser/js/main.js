'use strict'

import { h, render } from 'preact'
import App from './components/app'

render(<App />, document.querySelector('[data-js="app"]'))
