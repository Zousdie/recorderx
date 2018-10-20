import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Recorder'
    },
    plugins: [buble(), uglify()]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'esm/index.js',
      format: 'es'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        externalHelpers: false
      })
    ]
  }
]
