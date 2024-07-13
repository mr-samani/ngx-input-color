import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { ColorHelper } from '../services/color.service';
import { Hsla, Hsva, Rgba } from '../models/formats';

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
  baseColor = '';
  board: Position = { x: 1, y: 0 };
  alpha = 1;
  ///--- RGBA
  rgba = new Rgba(0, 0, 0, 1);
  redSliderBackground = '';
  greenSliderBackground = '';
  blueSliderBackground = '';

  color = '';
  isSupportedEyeDrop: boolean;
  constructor() {
    this.isSupportedEyeDrop = 'EyeDropper' in window;
  }

  ngOnInit(): void {
    this.createBaseColor();
  }

  calcColor() {
    this.rgba = ColorHelper.hslaToRgba(this.hsla);
    //console.log(rgba);
    this.color = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';
  }

  createBaseColor() {
    const hsva = new Hsva(this.hue, 1, 1, 1);
    this.rgba = ColorHelper.hsvaToRgba(hsva);
    this.baseColor = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';
    this.onChangeDimension();
  }

  onChangeDimension() {
    const hsva = new Hsva(this.hue, this.board.x, 1 - this.board.y, this.alpha);
    this.rgba = ColorHelper.hsvaToRgba(hsva);
    this.color = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';
  }

  calcRGBA() {
    this.color = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';
    this.updateRgbSliderColor();
  }

  updateRgbSliderColor() {
    const { r, g, b } = this.rgba;

    this.redSliderBackground = `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`;
    this.greenSliderBackground = `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`;
    this.blueSliderBackground = `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`;
  }

  openEyeDrop() {
    // if (this.isSupportedEyeDrop) {
    //   let t=new EyeDropper().then(result=>{

    //   });
    // }
  }
}
