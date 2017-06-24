import { h, render } from 'preact'
import App from './components/app-canvas'
import { Provider } from 'preact-redux'
import store from './redux/store'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('[data-js="app"]')
)
