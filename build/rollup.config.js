import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-fill-html';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';

const { BABEL_MODULE } = process.env;

const eslintPlugin = eslint({
  throwOnError: true,
  throwOnWarning: false,
  include: ['src/**'],
  exclude: ['node_modules/**'],
});

const config = BABEL_MODULE === 'umd' ? [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/recorderx.min.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
    },
    plugins: [
      eslintPlugin,
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
  {
    input: 'examples/index.js',
    output: {
      file: 'dist/demo.min.js',
      format: 'umd',
      name: 'Recorderx',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      eslintPlugin,
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
      html({
        template: 'examples/index.html',
        filename: 'index.html',
      }),
    ],
  },
] : {
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
};

export default config;
