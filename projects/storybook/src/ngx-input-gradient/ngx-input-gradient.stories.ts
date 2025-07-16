import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxInputColorModule } from '../../../ngx-input-color/src/ngx-input-color.module';
import { NgxInputGradientComponent } from '../../../ngx-input-color/src/public-api';
import { NgxInputGradientModule } from '../../../ngx-input-color/src/ngx-input-gradient.module';

const meta: Meta<NgxInputGradientComponent> = {
  title: 'Demo/NgxInputGradient',
  component: NgxInputGradientComponent,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NgxInputGradientModule, NgxInputGradientComponent, NgxInputColorModule],
    }),
  ],
  render: (args) => ({
    props: { ...args },
    template: `
    <div class="flex flex-col gap-4">
    <ngx-input-gradient></ngx-input-gradient>
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<NgxInputGradientComponent>;
export const Default: Story = {
  parameters: {
    controls: {},
  },
  args: {
    closeTitle: 'انصراف',
    confirmTitle: 'تائید',
  },
  render: (args) => ({
    props: { ...args, bgColor: 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)' },
    template: `
    <div class="flex flex-col gap-4">
    <pre> {{bgColor}}</pre>
    <ngx-input-gradient [(ngModel)]="bgColor"></ngx-input-gradient>
    </div>`,
  }),
};
