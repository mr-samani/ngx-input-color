import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from './documentation/documentation.json';
setCompodocJson(docJson);
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from '@storybook/addon-docs/blocks';
import { EnumToArrayPipe } from '../../ngx-input-color/src/pipes/enum-to-array.pipe';
import { ColorInspector } from '../../ngx-input-color/src/models/ColorInspector.enum';

const preview: Preview = {
  // tags: ['autodocs'],
  argTypes: {},
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
