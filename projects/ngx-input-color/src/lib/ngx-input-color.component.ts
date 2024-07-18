import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { Position, SaturationComponent } from '../saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { ColorFormats } from '../models/color-formats';
import { CMYK, HSLA, RGBA } from '../utils/interfaces';
import { TinyColor } from '../utils/color-converter';

@Component({
  selector: 'ngx-input-color',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, SaturationComponent],
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NgxInputColorComponent implements OnInit {
  format: ColorFormats = ColorFormats.HSVA;

  hsla: HSLA;

  //--HSVA
  hue = 300;
  baseColor = 'rgb(0,0,0)';
  board: Position = { x: 1, y: 0 };
  alpha = 1;
  ///--- RGBA
  rgba: RGBA;
  redSliderBackground = '';
  greenSliderBackground = '';
  blueSliderBackground = '';
  ///--- Cmyk
  cmyk: CMYK;

  rgbaColor = '';
  hexColor = '';

  isSupportedEyeDrop: boolean;
  constructor() {
    this.isSupportedEyeDrop = 'EyeDropper' in window;
    this.hsla = { h: 0, s: 0, l: 0, a: 1 };
    this.rgba = { r: 0, g: 0, b: 0, a: 1 };
    this.cmyk = { c: 0, m: 0, y: 0, k: 0 };
  }

  ngOnInit(): void {}
  public get ColorFormats(): typeof ColorFormats {
    return ColorFormats;
  }

  openEyeDrop() {
    // if (this.isSupportedEyeDrop) {
    //   let t=new EyeDropper().then(result=>{
    //   });
    // }
  }

  regenerateColor() {
    switch (this.format) {
      case ColorFormats.HSVA:
        const hsva = {
          h: this.hue,
          s: this.board.x,
          v: 1 - this.board.y,
          a: this.alpha,
        };
        this.rgba = TinyColor.hsvaToRgba(hsva);
        break;
      case ColorFormats.HSLA:
        this.rgba = TinyColor.hslaToRgba(this.hsla);
        break;
      case ColorFormats.CMYK:
        this.rgba = TinyColor.cmykToRgb(this.cmyk, this.alpha);
        break;
    }
    this.rgbaColor = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';

    this.createBaseColor();
    this.updateRgbSliderColor();
    let color = new TinyColor(this.rgbaColor);
    this.hexColor = color.toHex8();
    this.hsla = color.toHsl();
    let hsv = color.toHsv();
    this.hue = Math.ceil(hsv.h);
    this.alpha = hsv.a;
    this.board = { x: +hsv.s, y: 1 - +hsv.v }; 
    this.cmyk = color.toCmyk();
  }

  createBaseColor() {
    let rgba = TinyColor.hsvaToRgba({ h: this.hue, s: 1, v: 1, a: 1 });
    this.baseColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
  }
  updateRgbSliderColor() {
    const { r, g, b } = this.rgba;
    this.redSliderBackground = `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`;
    this.greenSliderBackground = `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`;
    this.blueSliderBackground = `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`;
  }
}
