import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';
import html from 'rollup-plugin-fill-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const eslintPlugin = eslint({
  throwOnError: true,
  throwOnWarning: false,
  include: ['src/**'],
  exclude: ['node_modules/**'],
});

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'esm/index.js',
        format: 'es',
      },
      {
        file: 'lib/index.js',
        format: 'cjs',
        exports: 'named',
      },
    ],
    plugins: [
      eslintPlugin,
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
    ],
    external (id) {
      return /@babel\/runtime/.test(id);
    },
  },

  {
    input: 'src/index.js',
    output: {
      file: 'dist/recorderx.min.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
    },
    plugins: [
      eslintPlugin,
      buble(),
      uglify(),
    ],
  },

  {
    input: 'public/index.js',
    output: {
      file: 'demo/demo.min.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      eslintPlugin,
      buble(),
      uglify(),
      html({
        template: 'public/index.html',
        filename: 'index.html',
      }),
      serve('demo'),
      livereload(),
    ],
  },
];
