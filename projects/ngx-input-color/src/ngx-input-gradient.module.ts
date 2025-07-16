import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from './slider/slider.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { NgxInputGradientComponent, NgxInputGradientDirective } from './public-api';

@NgModule({
  declarations: [NgxInputGradientDirective],
  imports: [
    CommonModule,
    FormsModule,
    SliderComponent,
    RangeSliderComponent,
    NgxInputGradientComponent,
  ],
  exports: [NgxInputGradientComponent, NgxInputGradientDirective],
  providers: [],
})
export class NgxInputGradientModule {}
