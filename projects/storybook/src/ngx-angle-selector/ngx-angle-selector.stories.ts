import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxAngleSelectorComponent, NgxInputAngle } from 'ngx-input-color/angle-selector';

const meta: Meta<NgxAngleSelectorComponent> = {
  title: 'Demo/NgxAngleSelector',
  component: NgxAngleSelectorComponent,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NgxAngleSelectorComponent, NgxInputAngle],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgxAngleSelectorComponent>;
export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      model: 145,
      theme: 'auto',
      size: 100,
    },
    template: `
    <div class="flex flex-col gap-4">    
    Size:
    <div>
        <input name="size" [(ngModel)]="size" class="form-control" type="number" min="60" max="700"/> 
    </div>
    Theme:
    <div class="radio-group">
      <label>
        <input type="radio" name="theme" value="light" [(ngModel)]="theme" />
        Light
      </label>
      <label>
        <input type="radio" name="theme" value="dark" [(ngModel)]="theme" />
        Dark
      </label>
      <label>
        <input type="radio" name="theme" value="auto" [(ngModel)]="theme" />
        Auto
      </label>
    </div>
    <input
        type="text"
        [(ngModel)]="model"
        ngxInputAngle
        class="form-control"
        [size]="size" 
        [theme]="theme"
        type="number"/>

    </div>


 
    Inline Mode:
     <ngx-input-angle
        [(ngModel)]="model" 
        name="angleSelector" 
        [size]="size" 
        [theme]="theme">
      </ngx-input-angle>
      <p>{{model}}</p>
    `,
  }),
};
