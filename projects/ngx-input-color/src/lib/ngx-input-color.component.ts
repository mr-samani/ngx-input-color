import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { ColorHelper } from '../services/color.service';
import { Hsla } from '../models/formats';
 
@Component({
  selector: 'ngx-input-color',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  providers: [],
})
export class NgxInputColorComponent {
  hsla = new Hsla(0.33, 0.5, 0.5, 1);

  //--------------
  board?: Position;

  color = '';
  constructor() {}
  calcColor() { 
    let rgba =ColorHelper.hslaToRgba(this.hsla);
    console.log(rgba);
    this.color = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
  }

  onChangeBoard() {
    if (this.board) {
      // this.saturation = this.board.x;
      //this.lightness = 1- this.board.y;
   //   let rgba = this.colorService.hslaToRgba(this.hsla);
    //  this.color = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
    }
  }
}
