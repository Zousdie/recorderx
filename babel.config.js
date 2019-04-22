module.exports = function (api) {
  const { BABEL_MODULE } = process.env;

  const plugins = ['@babel/plugin-proposal-class-properties'];

  if (BABEL_MODULE !== 'umd') {
    plugins.push([
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: false,
        useESModules: true,
      },
    ]);
  }

  if (api) {
    api.cache(false);
  }

  return {
    presets: [
      '@babel/preset-env',
    ],
    plugins,
  };
};
