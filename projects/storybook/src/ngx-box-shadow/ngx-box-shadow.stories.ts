import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxBoxShadowComponent, NgxInputBoxShadowModule } from '../../../ngx-input-color/src/public-api';

const meta: Meta<NgxBoxShadowComponent> = {
  title: 'Demo/NgxBoxShadow',
  component: NgxBoxShadowComponent,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NgxInputBoxShadowModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgxBoxShadowComponent>;
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      model: '0 24px 46px 0 rgba(0,0,0,.04)',
    },
    template: `
      <ngx-box-shadow
        [(ngModel)]="model">
      </ngx-box-shadow>
      <p>{{model}}</p>
    `,
  }),
};
