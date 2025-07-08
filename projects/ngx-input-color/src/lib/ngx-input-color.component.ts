import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { ColorFormats } from '../models/color-formats';
import { CMYK, HSLA, RGBA } from '../utils/interfaces';
import { TinyColor } from '../utils/color-converter';
import { IPosition } from '@ngx-input-color/models/IPosition';
declare const EyeDropper: any;
@Component({
  selector: 'ngx-input-color',
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxInputColorComponent implements OnInit {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() showCloseButton = false;
  @Output() change = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  format: ColorFormats = ColorFormats.HSVA;
  isDarkColor = false;
  hsla: HSLA;

  //--HSVA
  hue = 300;
  baseColor = 'rgb(0,0,0)';
  board: IPosition = { x: 1, y: 0 };
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
  constructor(private cd: ChangeDetectorRef) {
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
    if (this.isSupportedEyeDrop) {
      let t = new EyeDropper().open();
      t.then((result: { sRGBHex: string }) => {
        this.hexColor = result.sRGBHex;
        this.initalColor(this.hexColor);
        this.createBaseColor();
        this.updateRgbSliderColor();
        this.cd.detectChanges();
      });
    }
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
    this.initalColor(this.rgbaColor);
    this.change.emit(this.hexColor);
  }

  private createBaseColor() {
    let rgba = TinyColor.hsvaToRgba({ h: this.hue, s: 1, v: 1, a: 1 });
    this.baseColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
  }
  private updateRgbSliderColor() {
    const { r, g, b } = this.rgba;
    this.redSliderBackground = `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`;
    this.greenSliderBackground = `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`;
    this.blueSliderBackground = `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`;
  }

  public initalColor(c: string | TinyColor) {
    let color;
    if (typeof c == 'string') {
      color = new TinyColor(c);
    } else {
      color = c;
    }
    this.rgba = color;
    this.rgbaColor = 'rgba(' + this.rgba.r + ',' + this.rgba.g + ',' + this.rgba.b + ',' + this.rgba.a + ')';
    this.hexColor = '#' + color.toHex8();
    this.hsla = color.toHsl();
    let hsv = color.toHsv();
    this.hue = Math.ceil(hsv.h);
    this.alpha = Math.round(hsv.a * 100) / 100;
    this.board = { x: +hsv.s, y: 1 - +hsv.v };
    this.cmyk = color.toCmyk();
    this.isDarkColor = color.isDark();
  }

  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  close() {
    this.cancel.emit();
  }

  ok() {
    this.confirm.emit(this.hexColor);
  }
}
