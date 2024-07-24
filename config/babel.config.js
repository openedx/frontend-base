module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'), {
        targets: { node: 'current' },
      },
    ],
    [
      require.resolve('@babel/preset-react'), {
        runtime: 'automatic',
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ],
  env: {
    i18n: {
      plugins: [
        [
          'formatjs',
        ],
      ],
    },
  },
};
