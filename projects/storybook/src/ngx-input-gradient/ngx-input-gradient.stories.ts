import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
      imports: [CommonModule, FormsModule, NgxInputGradientModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgxInputGradientComponent>;
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      model: 'linear-gradient(90deg, #f00 0%, #00f 100%)',
      onChange: (val: string) => {
        console.log('🎨 new gradient', val);
      },
    },
    template: `
      <ngx-input-gradient
        [(ngModel)]="model"
        (ngModelChange)="onChange($event)">
      </ngx-input-gradient>
    `,
  }),
};
export const InputGradient: Story = {
  render: (args) => ({
    props: {
      ...args,
      model: 'linear-gradient(90deg, #f00 0%, #00f 100%)',
    },
    template: `
    <input ngxInputGradient  [(ngModel)]="model" class="form-control" />
    <p>{{model}}</p>
          `,
  }),
};
