/* eslint-disable import/no-extraneous-dependencies */
import html from 'rollup-plugin-fill-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';

export default {
  input: 'examples/index.js',
  output: {
    file: 'dist/demo.min.js',
    format: 'umd',
    name: 'Recorderx',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: false,
      include: ['src/**', 'examples/**'],
      exclude: ['node_modules/**'],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    html({
      template: 'examples/index.html',
      filename: 'index.html',
    }),
    serve({
      host: '0.0.0.0',
      contentBase: 'dist',
    }),
    livereload(),
  ],
  watch: {
    exclude: 'node_modules/**',
    include: [
      'src/**',
      'examples/**',
    ],
  },
};
