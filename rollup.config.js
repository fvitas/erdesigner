import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/browser/js/main.js',
    dest: 'out/browser/js/bundle.js',
    format: 'cjs',
    globals: {
        preact: 'preact',
        redux: 'redux',
        decko: 'decko',
        uuid: 'uuid',
        lodash: 'lodash',
        'preact-redux': 'preact-redux',
        linkState: 'linkState'
    },
    external: [
        'preact',
        'redux',
        'decko',
        'uuid',
        'lodash',
        'preact-redux',
        'linkState'
    ],
    plugins: [
        babel()
    ],
    sourceMap: true
}
