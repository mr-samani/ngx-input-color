import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TinyColor } from '@ngx-input-color/utils/color-converter';
import { CMYK } from '@ngx-input-color/utils/interfaces';

@Component({
  selector: 'app-cmyk',
  templateUrl: './cmyk.component.html',
  styleUrls: ['./cmyk.component.scss'],
})
export class CmykComponent implements OnInit {
  cyanSliderBackground = '';
  magentaSliderBackground = '';
  yellowSliderBackground = '';
  keySliderBackground = '';

  cyan: number = 0;
  magenta: number = 0;
  yellow: number = 0;
  key: number = 0;
  private inputColor?: TinyColor;

  @Input() set color(c: TinyColor) {
    this.inputColor = c;
    if (!c) return;
    const cmyk = c.toCmyk();
    this.cyan = cmyk.c;
    this.magenta = cmyk.m;
    this.yellow = cmyk.y;
    this.key = cmyk.k;
    this.updateSliderBackgrounds(cmyk);
  }
  @Output() colorChange = new EventEmitter<TinyColor | undefined>();
  constructor() {}

  ngOnInit() {}
  generateColor() {
    try {
      const cmyk: CMYK = { c: this.cyan, m: this.magenta, y: this.yellow, k: this.key };
      const color = new TinyColor(cmyk);
      this.updateSliderBackgrounds(cmyk);
      if (color.equals(this.inputColor) == false) {
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }

  private updateSliderBackgrounds(cmyk: CMYK) {
    let baseColor = JSON.parse(JSON.stringify(cmyk));
    this.cyanSliderBackground = this.getChannelGradient('c', baseColor);
    this.magentaSliderBackground = this.getChannelGradient('m', baseColor);
    this.yellowSliderBackground = this.getChannelGradient('y', baseColor);
    this.keySliderBackground = this.getChannelGradient('k', baseColor);
  }

  private getChannelGradient(channel: keyof CMYK, cmyk: CMYK): string {
    const steps = 5;
    const colors: string[] = [];

    // رنگ سفید دقیق
    const white = { r: 255, g: 255, b: 255 };
    // رنگ انتهایی کانال
    const cmykEnd = { c: 0, m: 0, y: 0, k: 0, [channel]: 1 } as CMYK;
    const rgbEnd = TinyColor.cmykToRgb(cmykEnd, 1);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      // اینجا میان رنگ رو خطی بین سفید و rgbEnd بدست میاریم
      const r = Math.round(white.r + t * (+rgbEnd.r - white.r));
      const g = Math.round(white.g + t * (+rgbEnd.g - white.g));
      const b = Math.round(white.b + t * (+rgbEnd.b - white.b));

      colors.push(`rgb(${r},${g},${b})`);
    }

    return `linear-gradient(to right, ${colors.join(', ')})`;
  }
}
