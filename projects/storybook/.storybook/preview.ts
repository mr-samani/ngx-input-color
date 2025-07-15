import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from './documentation/documentation.json';
setCompodocJson(docJson);
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from '@storybook/addon-docs/blocks';
import { EnumToArrayPipe } from '../../ngx-input-color/src/pipes/enum-to-array.pipe';
import { ColorInspector } from '../../ngx-input-color/src/models/ColorInspector.enum';

const preview: Preview = {
  // tags: ['autodocs'],
  parameters: {
    ArgTypes: {
      ColorInspector: {
        control: {
          type: 'select',
          options:[0,1,2,3]// new EnumToArrayPipe().transform(ColorInspector),
        },
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {},
  },
};

export default preview;
