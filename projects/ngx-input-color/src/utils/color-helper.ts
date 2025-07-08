import { Color, CMYK, HSL, RGB, HSV } from 'color-core';

export type ColorInput = string | CMYK | HSL | HSV | RGB | NgxColor;

export class NgxColor {
  private _color: Color;

  constructor(input?: ColorInput) {
    if (input instanceof NgxColor) {
      this._color = input._color;
      return;
    }
    this._color = new Color(input ?? '#000000');
    if (input && (input as any).a) this._color.setAlpha((input as any).a);
  }

  get isValid(): boolean {
    return !!this._color;
  }

  async name() {
    const name = await this._color.getName();
    return name ?? '';
  }

  toRgb(): RGB {
    return this._color.toRgb();
  }

  toRgbString(): string {
    const { r, g, b, a } = this.toRgb();
    return `rgba(${r},${g},${b},${a})`;
  }

  toHexString(): string {
    return this._color.toHex();
  }

  toHsl(): HSL {
    return this._color.toHsl();
  }

  toHsv(): HSV {
    return this._color.toHsv();
  }

  toCmyk(): CMYK {
    return this._color.toCmyk();
  }

  static cmykToRgb(cmyk: CMYK): RGB {
    const temp = new Color(cmyk);
    return temp.toRgb();
  }

  equals(other?: NgxColor): boolean {
    return this.toHexString().toLowerCase() === other?.toHexString().toLowerCase();
  }

  isDark(): boolean {
    return this._color.isLight() === false;
  }

  isLight(): boolean {
    return this._color.isLight();
  }
}
