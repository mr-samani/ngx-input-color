import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {
      docs: {
        defaultName: 'Documentation',
        // دقیقا همون مسیر خروجی compodoc
        compodoc: 'projects/storybook/.storybook/documentation/documentation.json',
      },
    },
  },
  staticDirs: [{ from: '../src/assets', to: '/assets' }],
};
export default config;
