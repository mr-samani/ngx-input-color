import { applicationConfig, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

import { ButtonComponent } from './button.component';
import { NgxInputColorComponent, NgxInputColorDirective } from '../public-api';
import { NgxInputColorModule } from '../ngx-input-color.module';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { EnumToArrayPipe } from '../pipes/enum-to-array.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<NgxInputColorComponent> = {
  title: 'NgxInputColorComponent',
  component: NgxInputColorComponent,
  tags: ['autodocs'],
  //   argTypes: {
  //     closeTitle: {
  //       control: 'text',
  //     },
  //   },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},

  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        EnumToArrayPipe,
        NgxInputColorModule
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgxInputColorComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
