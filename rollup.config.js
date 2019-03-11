import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
    },
    plugins: [
      buble(),
    ],
  },

  {
    input: 'src/main.js',
    output: {
      file: 'dist/recorderx.min.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
    },
    plugins: [
      buble(),
      uglify(),
    ],
  },

  {
    input: 'src/main.js',
    output: {
      file: 'esm/index.js',
      format: 'es',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
    ],
  },
];
