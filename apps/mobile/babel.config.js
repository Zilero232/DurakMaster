module.exports = (api) => {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { reactCompiler: true }]],
    plugins: ['react-native-worklets/plugin']
  };
};
