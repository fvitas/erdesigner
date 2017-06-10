import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/browser/js/main.js',
    dest: 'out/browser/js/bundle.js',
    format: 'cjs',
    globals: {
        preact: 'preact',
        redux: 'redux',
        decko: 'decko',
        uuid: 'uuid'
    },
    external: [
        'preact',
        'redux',
        'decko',
        'uuid'
    ],
    plugins: [
        babel()
    ],
    sourceMap: true
}
