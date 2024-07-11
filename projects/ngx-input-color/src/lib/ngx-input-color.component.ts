import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { hslToRgb } from '../helper/color';

@Component({
  selector: 'ngx-input-color',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
})
export class NgxInputColorComponent {
  hue = 0.33; // یک مقدار بین 0 تا 1
  saturation = 0.5; // یک مقدار بین 0 تا 1
  lightness = 0.5; // یک مقدار بین 0 تا 1
  alpha = 1;
  //--------------
  board?: Position;

  color = '';
  calcColor() {
    this.board = {
      x: this.saturation,
      y: this.lightness,
    };
    let rgb = hslToRgb(this.hue, this.saturation, this.lightness);
    this.color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + this.alpha + ')';
  }

  onChangeBoard() {
    if (this.board) {
      this.saturation = this.board.x;
      this.lightness = this.board.y;
      let rgb = hslToRgb(this.hue, this.saturation, this.lightness);
      this.color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + this.alpha + ')';
    }
  }
}
