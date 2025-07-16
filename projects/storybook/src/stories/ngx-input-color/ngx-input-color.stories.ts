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
  render: (args) => ({
    props: { ...args, myColor: '#5d00f1ff' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor"></ngx-input-color>
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<NgxInputColorComponent>;
//_________________________________________________________________________________________________________
export const Default: Story = {
  parameters: {
    controls: {},
  },
  args: {
    closeTitle: 'انصراف',
    confirmTitle: 'تائید',
  },
  render: (args) => ({
    props: { ...args, myColor: '#01a13fff' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor"></ngx-input-color>
    </div>`,
  }),
};
//_________________________________________________________________________________________________________
export const RGB: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.RGB,
    outputType: 'RGB',
  },
  render: (args) => ({
    props: { ...args, myColor: '#9c01a1ff' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor" [outputType]="outputType"></ngx-input-color>
    </div>`,
  }),
};
//_________________________________________________________________________________________________________
export const HSL: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.HSL,
    outputType: 'HSL',
  },
  render: (args) => ({
    props: { ...args, myColor: 'hsl(296, 88%, 87%)' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor" [outputType]="outputType"></ngx-input-color>
    </div>`,
  }),
};
//__
//_________________________________________________________________________________________________________
export const HSV: Story = {
  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.Picker,
    outputType: 'HSV',
  },
  render: (args) => ({
    props: { ...args, myColor: '#ff0040ff' },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color [(ngModel)]="myColor" [outputType]="outputType"></ngx-input-color>
    </div>`,
  }),
};
//_________________________________________________________________________________________________________
export const Minimal: Story = {
  name: 'Minimal UI',

  parameters: {
    controls: {},
  },
  args: {
    defaultInspector: ColorInspector.Picker,
    simpleMode: true,
    showCloseButton: false,
    showConfirmButton: false,
  },
  render: (args) => ({
    props: { ...args, myColor: 'pink' },

    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color 
        [(ngModel)]="myColor"
        [simpleMode]="simpleMode"
        [showCloseButton]="showCloseButton"
        [showConfirmButton]="showConfirmButton"
        ></ngx-input-color>
    </div>`,
  }),
};
