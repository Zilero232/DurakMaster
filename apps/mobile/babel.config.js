const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const REMOVE_TEST_PROPS = ['react-remove-properties', { properties: ['testID', 'data-testid'] }];

module.exports = (api) => {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { reactCompiler: true }]],
    plugins: ['react-native-worklets/plugin', ...(IS_PRODUCTION ? [REMOVE_TEST_PROPS] : [])]
  };
};
