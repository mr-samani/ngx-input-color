import { NgModule } from '@angular/core';
import { NgxInputColorDirective } from './directives/ngx-input-color.directive';
import { NgxInputColorComponent } from './public-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaturationComponent } from './saturation/saturation.component';
import { SliderComponent } from './slider/slider.component';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { PickerComponent } from './lib/inspectors/picker/picker.component';
import { CmykComponent } from './lib/inspectors/cmyk/cmyk.component';
import { HslComponent } from './lib/inspectors/hsl/hsl.component';
import { RgbComponent } from './lib/inspectors/rgb/rgb.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { NgxInputGradientComponent } from './lib/ngx-input-gradient/ngx-input-gradient.component';

@NgModule({
  declarations: [
    NgxInputColorDirective,
    NgxInputColorComponent,
    PickerComponent,
    CmykComponent,
    HslComponent,
    RgbComponent,
  ],
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent, RangeSliderComponent, EnumToArrayPipe],
  exports: [NgxInputColorComponent, NgxInputColorDirective],
  providers: [],
})
export class NgxInputColorModule {}
