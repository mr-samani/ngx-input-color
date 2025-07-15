import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

import { NgxInputColorComponent } from '../../../../ngx-input-color/src/public-api';
import { NgxInputColorModule } from '../../../../ngx-input-color/src/ngx-input-color.module';
import { EnumToArrayPipe } from '../../../../ngx-input-color/src/pipes/enum-to-array.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColorInspector } from '../../../../ngx-input-color/src/models/ColorInspector.enum';
import { Controls } from '@storybook/addon-docs/blocks';
import { NgxColor } from '../../../../ngx-input-color/src/utils/color-helper';

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
    closeTitle: 'انصراف',
    confirmTitle: 'تائید',
  },
};
export const RGB: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.RGB,
  },
};
export const HSL: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.HSL,
  },
  render: (args) => ({
    props: { ...args, myColor: 'hsl(296, 88%, 87%)' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor"></ngx-input-color>
    </div>`,
  }),
};
export const Minimal: Story = {
  name: 'Minimal UI',
  render: (args) => ({
    props: args,
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color 
        [(ngModel)]="myColor"
        [defaultInspector]="defaultInspector" 
        [simpleMode]="simpleMode" 
        [showCloseButton]="showCloseButton" 
        [showConfirmButton]="showConfirmButton"
        [closeTitle]="closeTitle"
        [confirmTitle]="confirmTitle"
        ></ngx-input-color>
    </div>`,
  }),
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.Picker,
    simpleMode: true,
    showCloseButton: false,
    showConfirmButton: false,
  },
};
