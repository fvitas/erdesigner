import { h, render } from 'preact'
import ERDiagramApp from './components/er-diagram-app'
import { Provider } from 'preact-redux'
import store from './redux/store'

render(
    <Provider store={store}>
        <ERDiagramApp />
    </Provider>,
    document.querySelector('[data-js="app"]')
)
