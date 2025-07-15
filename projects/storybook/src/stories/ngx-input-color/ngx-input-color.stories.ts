import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

import { NgxInputColorComponent } from '../../../../ngx-input-color/src/public-api';
import { NgxInputColorModule } from '../../../../ngx-input-color/src/ngx-input-color.module';
import { EnumToArrayPipe } from '../../../../ngx-input-color/src/pipes/enum-to-array.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColorInspector } from '../../../../ngx-input-color/src/models/ColorInspector.enum';
import { Controls } from '@storybook/addon-docs/blocks';

const meta: Meta<NgxInputColorComponent> = {
  title: 'Demo/NgxInputColor',
  component: NgxInputColorComponent,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    defaultInspector: ColorInspector.Picker,
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, EnumToArrayPipe, NgxInputColorModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgxInputColorComponent>;

export const Default: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.Picker,
  },
};
export const DefaultRGB: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.RGB,
  },
};
