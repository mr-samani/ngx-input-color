import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxColor } from '@ngx-input-color/utils/color-helper';
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
  private inputColorCmyk?: CMYK;

  @Input() set color(c: NgxColor) {
    if (!c) return;
    const cmyk = c.toCmyk();
    console.log('inputedColor', cmyk);
    this.inputColorCmyk = cmyk;
    this.cyan = cmyk.c;
    this.magenta = cmyk.m;
    this.yellow = cmyk.y;
    this.key = cmyk.k;
    // this.updateSliderBackgrounds(cmyk);
  }
  @Output() colorChange = new EventEmitter<NgxColor | undefined>();
  constructor() {}

  ngOnInit() {}
  generateColor() {
    try {
      const cmyk: CMYK = { c: this.cyan, m: this.magenta, y: this.yellow, k: this.key };
      const color = new NgxColor(cmyk);
      // this.updateSliderBackgrounds(cmyk);
      if (this.isCmykEqual(this.inputColorCmyk, cmyk) == false) {
        console.log('outputedColor', cmyk);
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }

  private updateSliderBackgrounds(cmyk: CMYK) {
    this.cyanSliderBackground = this.getChannelGradient('c', cmyk);
    this.magentaSliderBackground = this.getChannelGradient('m', cmyk);
    this.yellowSliderBackground = this.getChannelGradient('y', cmyk);
    this.keySliderBackground = this.getChannelGradient('k', cmyk);
  }

  private getChannelGradient(channel: keyof CMYK, cmyk: CMYK): string {
    let baseColor = this.cloneColor(cmyk);
    baseColor[channel] = channel == 'k' ? 1 : 0;
    let startColor = NgxColor.cmykToRgba(baseColor);
    let s = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;
    baseColor[channel] = 100;
    let endColor = NgxColor.cmykToRgba(baseColor);
    let e = `rgb(${endColor.r}, ${endColor.g}, ${endColor.b})`;

    return `linear-gradient(to right,  ${s},${e})`;
  }
  private isCmykEqual(a?: CMYK, b?: CMYK): boolean {
    if (!a || !b) return false;
    return a.c === b.c && a.m === b.m && a.y === b.y && a.k === b.k;
  }

  private cloneColor(cmyk: CMYK): CMYK {
    return JSON.parse(JSON.stringify(cmyk));
    // return Object.assign({}, cmyk);
  }
}
