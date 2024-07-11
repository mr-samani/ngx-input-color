import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { ColorService } from '../services/color.service';
import { Hsva } from '../models/formats';
 
@Component({
  selector: 'ngx-input-color',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  providers: [ColorService],
})
export class NgxInputColorComponent {
  hsva = new Hsva(0.33, 0.5, 0.5, 1);

  //--------------
  board?: Position;

  color = '';
  constructor(private colorService: ColorService) {}
  calcColor() {
    let rgba = this.colorService.hsvaToRgba(this.hsva);
    console.log(rgba);
    this.color = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
  }

  onChangeBoard() {
    if (this.board) {
      // this.saturation = this.board.x;
      //this.lightness = 1- this.board.y;
      let rgba = this.colorService.hsvaToRgba(this.hsva);
      this.color = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
    }
  }
}
