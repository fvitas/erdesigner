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
        linkState: 'linkState'
    },
    external: [
        'preact',
        'redux',
        'decko',
        'uuid',
        'lodash',
        'linkState'
    ],
    plugins: [
        babel()
    ],
    sourceMap: true
}
