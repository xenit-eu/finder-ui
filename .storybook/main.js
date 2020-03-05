var path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.tsx', '../src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/preset-typescript',
      options: {
        include: [path.resolve(__dirname, '../src')],
      }
    },
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    });

    return config;
  },
};
