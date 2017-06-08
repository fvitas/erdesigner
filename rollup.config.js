import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/browser/js/main.js',
    dest: 'out/browser/js/bundle.js',
    format: 'cjs',
    globals: {
        preact: 'preact',
        redux: 'redux',
        decko: 'decko'
    },
    external: [
        'preact',
        'redux',
        'decko'
    ],
    plugins: [
        babel()
    ],
    sourceMap: true
}
