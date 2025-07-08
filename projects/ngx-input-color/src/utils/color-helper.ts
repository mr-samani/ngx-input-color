import Color from 'colorjs.io';
import { CMYK, HSLA, HSVA, RGBA } from './interfaces';

export type ColorInput = string | CMYK | HSLA | HSVA | RGBA | NgxColor;

export class NgxColor {
  private _color: Color | null = null;

  constructor(input?: ColorInput) {
    try {
      if (input instanceof NgxColor) {
        this._color = input._color ? new Color(input._color) : null;
      } else if (typeof input === 'string') {
        this._color = new Color(input);
      } else if (input && 'c' in input && 'm' in input && 'y' in input && 'k' in input) {
        const { r, g, b, a } = NgxColor.cmykToRgb(input);
        this._color = new Color({ space: 'srgb', coords: [r / 255, g / 255, b / 255], alpha: a });
      } else if (input && 'h' in input && 's' in input && 'l' in input) {
        const { h, s, l, a } = input as HSLA;
        this._color = new Color({ space: 'hsl', coords: [h, s, l], alpha: a ?? 1 });
      } else if (input && 'h' in input && 's' in input && 'v' in input) {
        const { h, s, v, a } = input as HSVA;
        this._color = new Color({ space: 'hsv', coords: [h, s, v], alpha: a ?? 1 });
      } else if (input && 'r' in input && 'g' in input && 'b' in input) {
        const { r, g, b, a } = input as RGBA;
        this._color = new Color({ space: 'srgb', coords: [r / 255, g / 255, b / 255], alpha: a ?? 1 });
      }
    } catch {
      this._color = null;
    }
  }

  get isValid(): boolean {
    return !!this._color;
  }

  get name(): string {
    if (!this._color) return '';
    try {
      return '';
      const hex = this.toHex8String().substring(0, 7);
      const named = Color.names.find(
        ([name, value]) => new Color(value).to('srgb').toString({ format: 'hex' }) === hex
      );
      return named ? named[0] : '';
    } catch {
      return '';
    }
  }

  toRgb(): RGBA {
    if (!this._color) return { r: 0, g: 0, b: 0, a: 1 };
    const [r, g, b] = this._color.to('srgb').coords.map((v) => Math.round(v * 255));
    const a = this._color.alpha ?? 1;
    return { r, g, b, a };
  }

  toRgbString(): string {
    const { r, g, b, a } = this.toRgb();
    return `rgba(${r},${g},${b},${a})`;
  }

  toHex8String(): string {
    if (!this._color) return '#000000ff';
    return this._color.toString({ format: 'hex' });
  }

  toHsl(): HSLA {
    if (!this._color) return { h: 0, s: 0, l: 0, a: 1 };
    const [h, s, l] = this._color.to('hsl').coords;
    return { h, s, l, a: this._color.alpha ?? 1 };
  }

  toHsv(): HSVA {
    if (!this._color) return { h: 0, s: 0, v: 0, a: 1 };
    const [h, s, v] = this._color.to('hsv').coords;
    return { h, s, v, a: this._color.alpha ?? 1 };
  }

  toCmyk(): CMYK {
    const { r, g, b } = this.toRgb();
    const rf = r / 255;
    const gf = g / 255;
    const bf = b / 255;

    const k = 1 - Math.max(rf, gf, bf);
    const c = k === 1 ? 0 : (1 - rf - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gf - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bf - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  }

  static cmykToRgb(cmyk: CMYK, alpha: number = 1): RGBA {
    const c = cmyk.c / 100;
    const m = cmyk.m / 100;
    const y = cmyk.y / 100;
    const k = cmyk.k / 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      a: alpha,
    };
  }

  isDark(): boolean {
    return this._color ? this._color.luminance < 0.5 : false;
  }

  equals(other?: NgxColor): boolean {
    if (!other || !other.isValid || !this.isValid) return false;
    return this.toHex8String().toLowerCase() === other.toHex8String().toLowerCase();
  }
}
