import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxColor } from '@ngx-input-color/utils/color-helper';
import { HSLA } from '@ngx-input-color/utils/interfaces';

@Component({
  selector: 'app-hsl',
  templateUrl: './hsl.component.html',
  styleUrls: ['./hsl.component.scss'],
})
export class HslComponent implements OnInit {
  hue: number = 0;
  saturation: number = 0;
  luminance: number = 0;
  alpha: number = 1;
  baseColor = 'rgb(0,0,0)';
  private inputColor?: NgxColor;

  @Input() set color(c: NgxColor) {
    this.inputColor = c;
    if (!c) return;
    const hsla = c.toHsl();
    this.hue = hsla.h;
    this.saturation = hsla.s;
    this.luminance = hsla.l;
    this.alpha = hsla.a;
    this.baseColor = c.toHex8String();
  }
  @Output() colorChange = new EventEmitter<NgxColor | undefined>();
  constructor() {}

  ngOnInit() {}

  generateColor() {
    try {
      const hsla: HSLA = { h: this.hue, s: this.saturation, l: this.luminance, a: this.alpha };
      const color = new NgxColor(hsla);
      this.baseColor = color.toHex8String();
      if (color.equals(this.inputColor) == false) {
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }
}
