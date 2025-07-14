import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { NgxInputColorComponent } from '../../../ngx-input-color/src/lib/ngx-input-color/ngx-input-color.component';

const meta: Meta<NgxInputColorComponent> = {
  title: 'NGX Input Color/Inline',
  component: NgxInputColorComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    colorInspector: {
      control: 'select',
      options: ['Picker', 'RGB', 'HSL', 'CMYK'],
    },
    showCloseButton: { control: 'boolean' },
    showConfirmButton: { control: 'boolean' },
    simpleMode: { control: 'boolean' },
    closeTitle: { control: 'text' },
    confirmTitle: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<NgxInputColorComponent>;

export const Inline: Story = {
  args: {
    showCloseButton: true,
    showConfirmButton: true,
    simpleMode: false,
    closeTitle: 'Cancel',
    confirmTitle: 'Select',
  },
};
