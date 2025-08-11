import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxInputColorComponent } from '../../../ngx-input-color/src/public-api';
import { NgxInputColorModule } from '../../../ngx-input-color/src/ngx-input-color.module';
import { EnumToArrayPipe } from '../../../ngx-input-color/src/pipes/enum-to-array.pipe';
import { ColorInspector } from '../../../ngx-input-color/src/models/ColorInspector.enum';

const meta: Meta<NgxInputColorComponent> = {
  title: 'Demo/NgxInputColor',
  component: NgxInputColorComponent,
  tags: ['autodocs'],
  argTypes: {
    defaultInspector: {
      options: Object.keys(ColorInspector)
        .filter((key) => !isNaN(parseInt(key)))
        .map((key) => parseInt(key)),
      control: {
        type: 'select',
        labels: Object.values(ColorInspector).filter((value) => typeof value === 'string'),
      },
    },
    outputType: {
      options: ['CMYK', 'HSL', 'HSV', 'RGB', 'HEX', 'HEXA'],
      control: {
        type: 'select',
      },
    },
  },
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
  args: {},
  render: (args) => ({
    props: {
      ...args,
      myColor: '#01a13fff',
      outputType: 'HEX',
      simpleMode: false,
      inspector: ColorInspector.Picker,
    },
    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>

    <div>
      <label>
        <input type="checkbox" name="simpleMode" [(ngModel)]="simpleMode" />
        Simple Mode
      </label>
    </div>

    Output:
    <div class="radio-group">
      <label>
        <input type="radio" name="outputtype" value="HEX" [(ngModel)]="outputType" />
        HEX
      </label>
      <label>
        <input type="radio" name="outputtype" value="RGB" [(ngModel)]="outputType" />
        RGB
      </label>
      <label>
        <input type="radio" name="outputtype" value="HSV" [(ngModel)]="outputType" />
        HSV
      </label>
      <label>
        <input type="radio" name="outputtype" value="HSL" [(ngModel)]="outputType" />
        HSL
      </label>
      <label>
        <input type="radio" name="outputtype" value="CMYK" [(ngModel)]="outputType" />
        CMYK
      </label>
    </div>
    Inspector:
    <div class="radio-group">
      <label>
        <input type="radio" name="inspector" [value]="0" [(ngModel)]="inspector" />
        Picker
      </label>
      <label>
        <input type="radio" name="inspector" [value]="1" [(ngModel)]="inspector" />
        RGB
      </label>
      <label>
        <input type="radio" name="inspector" [value]="2" [(ngModel)]="inspector" />
        HSL
      </label>
      <label>
        <input type="radio" name="inspector" [value]="3" [(ngModel)]="inspector" />
        CMYK
      </label>
    </div>
    <input
        type="text"
        [(ngModel)]="myColor"
        ngxInputColor
        class="form-control"
        [simpleMode]="simpleMode"
        [outputType]="outputType"
        [defaultInspector]="inspector" />

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
  },
  render: (args) => ({
    props: { ...args, myColor: 'pink' },

    template: `
    <div class="flex flex-col gap-4">
    <h1> {{myColor}}</h1>
    <ngx-input-color 
        [(ngModel)]="myColor"
        [simpleMode]="simpleMode"
        ></ngx-input-color>
    </div>`,
  }),
};

//_________________________________________________________________________________________________________
export const InputDirective: Story = {
  name: 'Input',

  parameters: {
    controls: {},
  },
  args: {
    simpleMode: true,
  },
  render: (args) => ({
    props: { ...args, myColor: 'pink' },

    template: `
    <div class="flex flex-col gap-4">
    <h1> ngxInputColor = {{myColor}}</h1>
    <input ngxInputColor 
        [(ngModel)]="myColor" 
        [simpleMode]="simpleMode"
        class="form-control" />
    </div>`,
  }),
};
