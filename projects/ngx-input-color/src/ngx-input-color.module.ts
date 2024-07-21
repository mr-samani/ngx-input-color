import { NgModule } from '@angular/core';
import { NgxInputColorDirective } from './directives/ngx-input-color.directive';
import { NgxInputColorComponent } from './public-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaturationComponent } from './saturation/saturation.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  declarations: [NgxInputColorComponent, NgxInputColorDirective],
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  exports: [NgxInputColorComponent, NgxInputColorDirective],
  providers: [],
})
export class NgxInputColorModule {}
