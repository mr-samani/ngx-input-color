import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxColor } from '../../../utils/color-helper';
import { RGBA } from '../../../utils/interfaces';

@Component({
  selector: 'app-rgb',
  templateUrl: './rgb.component.html',
  styleUrls: ['./rgb.component.scss'],
  standalone: false,
})
export class RgbComponent implements OnInit {
  redSliderBackground = '';
  greenSliderBackground = '';
  blueSliderBackground = '';

  baseColor = 'rgb(0,0,0)';
  red: number = 0;
  green: number = 0;
  blue: number = 0;
  alpha: number = 1;

  private inputColor?: NgxColor;
  @Input() set color(c: NgxColor) {
    if (c.equals(this.inputColor)) return;
    this.inputColor = c;
    const rgba = c.toRgb();
    this.red = rgba.r;
    this.green = rgba.g;
    this.blue = rgba.b;
    this.alpha = rgba.a ?? 1;
    this.updateRgbSliderColor(rgba as any);
  }
  @Output() colorChange = new EventEmitter<NgxColor | undefined>();
  constructor() {}

  ngOnInit() {}

  generateColor() {
    try {
      const rgba: RGBA = { r: this.red, g: this.green, b: this.blue, a: this.alpha };
      const color = new NgxColor(rgba);
      this.updateRgbSliderColor(rgba);
      if (color.equals(this.inputColor) == false) {
        this.inputColor = color;
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }

  private updateRgbSliderColor(rgba: RGBA) {
    const { r, g, b } = rgba;
    this.redSliderBackground = `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`;
    this.greenSliderBackground = `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`;
    this.blueSliderBackground = `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`;
    this.baseColor = `rgb(${r}, ${g}, ${b})`;
  }
}
