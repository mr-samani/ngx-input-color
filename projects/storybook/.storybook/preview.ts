import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from './documentation/documentation.json';
setCompodocJson(docJson); 

const preview: Preview = {
  // tags: ['autodocs'],
  argTypes: {},
  parameters: {
    actions: { },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: false, // حذف دکمه 'set object'
    },
    docs: {},
  },
};

export default preview;
