import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxBoxShadowComponent, NgxInputBoxShadowDirective } from './public-api';

@NgModule({
  declarations: [NgxInputBoxShadowDirective],
  imports: [CommonModule, FormsModule, NgxBoxShadowComponent],
  exports: [NgxBoxShadowComponent, NgxInputBoxShadowDirective],
  providers: [],
})
export class NgxInputBoxShadowModule {}
