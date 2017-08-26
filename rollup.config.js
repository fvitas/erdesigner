import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/browser/js/main.js',
    dest: 'app/browser/js/bundle.js',
    format: 'cjs',
    globals: {
        preact: 'preact',
        redux: 'redux',
        decko: 'decko',
        uuid: 'uuid',
        lodash: 'lodash',
        'preact-redux': 'preact-redux',
        'preact-portal': 'preact-portal'
    },
    external: [
        'preact',
        'redux',
        'decko',
        'uuid',
        'lodash',
        'preact-redux',
        'preact-portal'
    ],
    plugins: [
        babel()
    ],
    sourceMap: true
}
