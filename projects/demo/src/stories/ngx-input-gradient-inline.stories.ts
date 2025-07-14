import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { NgxInputGradientComponent } from '../../../ngx-input-color/src/lib/ngx-input-gradient/ngx-input-gradient.component';

const meta: Meta<NgxInputGradientComponent> = {
  title: 'NGX Input Gradient/Inline',
  component: NgxInputGradientComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    showCloseButton: { control: 'boolean' },
    closeTitle: { control: 'text' },
    confirmTitle: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<NgxInputGradientComponent>;

export const Inline: Story = {
  args: {
    showCloseButton: true,
    closeTitle: 'Cancel',
    confirmTitle: 'Done',
  },
};
