import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/browser/main.js',
    dest: 'out/browser/bundle.js',
    format: 'cjs',
    plugins: [
        json(),
        babel()
    ],
    sourceMap: true
}
