import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { ColorHelper } from '../services/color.service';
import { Hsla, Hsva } from '../models/formats';

@Component({
  selector: 'ngx-input-color',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  providers: [],
})
export class NgxInputColorComponent implements OnInit {
  format = 'hsva';

  hsla = new Hsla(0.33, 0.5, 0.5, 1);

  //--HSVA
  hue = 300;
  alpha = 1;
  baseColor = '';

  //--------------
  board: Position = { x: 1, y: 0 };

  color = '';
  constructor() {}

  ngOnInit(): void {
   this.createBaseColor();
  }

  calcColor() {
    let rgba = ColorHelper.hslaToRgba(this.hsla);
    //console.log(rgba);
    this.color = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
  }


  createBaseColor(){
    const hsva = new Hsva(this.hue, 1, 1,1);
    let rgba = ColorHelper.hsvaToRgba(hsva);
    this.baseColor = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
    this.onChangeDimension();
  }


  onChangeDimension() {
    const hsva = new Hsva(this.hue, this.board.x,1- this.board.y, this.alpha);
    let rgba = ColorHelper.hsvaToRgba(hsva);
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
