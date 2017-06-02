import preact, { h } from 'preact'

var a = 1

if (a < 5) {
    console.log(a)
}

const Hello = ({name}) => {
    return (
        <span>{name}</span>
    )
}

preact.render(
    <div>
        <Hello name='world!' />
        <button onClick={() => alert('hi!')}>Click me</button>
    </div>,

    document.querySelector('[data-js="app"]')
)
