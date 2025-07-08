import chroma, { Color } from 'chroma-js';
import { CMYK, HSL, HSLA, HSV, HSVA, RGB, RGBA } from './interfaces';

export type ColorInput = string | CMYK | HSLA | HSVA | RGBA | NgxColor;

export class NgxColor {
  private _color: Color | null = null;
  private _alpha: number = 1;

  constructor(input?: ColorInput) {
    if (input instanceof NgxColor) {
      this._color = input._color ? chroma(input._color) : null;
      this._alpha = input._alpha;
    } else if (typeof input === 'string') {
      try {
        this._color = chroma(input);
        this._alpha = this._color.alpha();
      } catch (e) {
        this._color = null;
      }
    } else if (input && 'c' in input && 'm' in input && 'y' in input && 'k' in input) {
      const { c, m, y, k } = input;
      this._color = chroma.cmyk(c, m, y, k);
    } else if (input && 'h' in input && 's' in input && 'l' in input) {
      const { h, s, l, a } = input as HSLA;
      this._color = chroma.hsl(h, s, l);
      this._alpha = a ?? 1;
    } else if (input && 'h' in input && 's' in input && 'v' in input) {
      const { h, s, v, a } = input as HSVA;
      this._color = chroma.hsv(h, s, v);
      this._alpha = a ?? 1;
    } else if (input && 'r' in input && 'g' in input && 'b' in input) {
      const { r, g, b, a } = input as RGBA;
      this._color = chroma.rgb(r, g, b);
      this._alpha = a ?? 1;
    }
  }

  get isValid(): boolean {
    return this._color !== null && chroma.valid(this._color);
  }

  get name(): string {
    let name = this._color?.name() ?? '';
    return name.startsWith('#') ? '' : name;
  }

  toRgb(): RGBA {
    if (!this.isValid || !this._color) return { r: 0, g: 0, b: 0, a: 1 };
    const [r, g, b] = this._color.rgb();
    return { r, g, b, a: this._alpha };
  }

  toRgbString(): string {
    if (!this.isValid || !this._color) return 'rgba(0,0,0,1)';
    const { r, g, b, a } = this.toRgb();
    return `rgba(${r},${g},${b},${a})`;
  }

  toHex8String(): string {
    if (!this.isValid || !this._color) return '#000000ff';
    return this._color.alpha(this._alpha).hex('rgba');
  }

  toHsl(): HSLA {
    if (!this.isValid || !this._color) return { h: 0, s: 0, l: 0, a: 1 };
    const [h, s, l] = this._color.hsl();
    return { h, s, l, a: this._alpha };
  }

  toHsv(): HSVA {
    if (!this.isValid || !this._color) return { h: 0, s: 0, v: 0, a: 1 };
    const [h, s, v] = this._color.hsv();
    return { h, s, v, a: this._alpha };
  }

  toCmyk(): CMYK {
    if (!this.isValid || !this._color) return { c: 0, m: 0, y: 0, k: 0 };
    const [c, m, y, k] = this._color.cmyk();
    return { c, m, y, k };
  }

  static cmykToRgb(cmyk: CMYK, alpha: number = 1): RGBA {
    let color = chroma.cmyk(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
    color.alpha(alpha);
    const [r, g, b] = color.rgb();
    return { r, g, b, a: alpha };
  }

  isDark(): boolean {
    return this._color ? this._color.luminance() < 0.5 : false;
  }

  equals(other?: NgxColor): boolean {
    if (!other || !other.isValid || !this.isValid) return false;
    return this.toHex8String().toLowerCase() === other.toHex8String().toLowerCase();
  }
}
