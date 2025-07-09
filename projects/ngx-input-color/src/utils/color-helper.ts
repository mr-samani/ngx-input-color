import {
  cmykToRgb,
  hexToRgb,
  hslToRgb,
  hsvToRgb,
  parseCmykString,
  parseHslString,
  parseHsvString,
  parseRgbString,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './conversion';
import { colorNames } from './css-color-names';
import { CMYK, HSL, HSLA, HSV, HSVA, RGB, RGBA } from './interfaces';
export type ColorInput = string | CMYK | HSLA | HSVA | RGBA | NgxColor;

export class NgxColor {
  private _rgb: RGBA = { r: 0, g: 0, b: 0, a: 1 };
  private _format: 'rgb' | 'hsl' | 'hsv' | 'cmyk' | 'name' = 'rgb';
  private _name: string = '';

  constructor(input?: ColorInput) {
    if (!input) return;
    if (input instanceof NgxColor) {
      this._rgb = { ...input._rgb };
      this._format = input._format;
      this._name = input._name;
      return;
    }
    if (typeof input === 'object') {
      if ('r' in input && 'g' in input && 'b' in input) {
        this._rgb = { r: +input.r, g: +input.g, b: +input.b, a: (input as any).a !== undefined ? +input.a : 1 };
        this._format = 'rgb';
        return;
      }
      if ('h' in input && 's' in input && 'l' in input) {
        this._rgb = NgxColor.hslaToRgba(input as HSLA);
        this._format = 'hsl';
        return;
      }
      if ('h' in input && 's' in input && 'v' in input) {
        this._rgb = NgxColor.hsvaToRgba(input as HSVA);
        this._format = 'hsv';
        return;
      }
      if ('c' in input && 'm' in input && 'y' in input && 'k' in input) {
        this._rgb = NgxColor.cmykToRgba(input as CMYK);
        this._format = 'cmyk';
        return;
      }
    }
    if (typeof input === 'string') {
      const name = input.trim().toLowerCase();
      if (colorNames[name]) {
        this._rgb = hexToRgb(colorNames[name]);
        this._format = 'name';
        this._name = name;
        return;
      } else if (/^#?[0-9a-f]{3,8}$/i.test(name)) {
        this._rgb = hexToRgb(name);
        this._format = 'rgb';
        return;
      }
      if (name.includes('rgb')) {
        this._rgb = parseRgbString(name);
        this._format = 'rgb';
        return;
      }
      if (name.includes('hsl')) {
        this._rgb = NgxColor.hslaToRgba(parseHslString(name));
        this._format = 'hsl';
        return;
      }
      if (name.includes('hsv')) {
        this._rgb = NgxColor.hsvaToRgba(parseHsvString(name));
        this._format = 'hsv';
        return;
      }
      if (name.includes('cmyk')) {
        this._rgb = NgxColor.cmykToRgba(parseCmykString(name));
        this._format = 'cmyk';
        return;
      }
      throw new Error('Unknown color string: ' + input);
    }
  }

  get isValid(): boolean {
    return (
      typeof this._rgb.r === 'number' &&
      typeof this._rgb.g === 'number' &&
      typeof this._rgb.b === 'number' &&
      !isNaN(this._rgb.r) &&
      !isNaN(this._rgb.g) &&
      !isNaN(this._rgb.b)
    );
  }

  async name() {
    if (this._name) return this._name;
    const hex = this.toHexString();
    for (const [n, h] of Object.entries(colorNames)) {
      if (h.toLowerCase() === hex.toLowerCase()) return n;
    }
    return '';
  }

  toRgb(): RGBA {
    return this._rgb;
  }

  toRgbString(): string {
    const { r, g, b, a } = this.toRgb();
    return a === 1
      ? `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
      : `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${+a.toFixed(3)})`;
  }

  toHexString(): string {
    const { r, g, b, a } = this.toRgb();
    return '#' + rgbToHex(r, g, b, a < 1);
  }

  toHsl(): HSLA {
    return NgxColor.rgbToHsla(this.toRgb());
  }

  toHsv(): HSVA {
    return NgxColor.rgbToHsva(this.toRgb());
  }

  toCmyk(): CMYK {
    return NgxColor.rgbToCmyk(this.toRgb());
  }

  static cmykToRgba(cmyk: CMYK): RGBA {
    const { c, m, y, k } = cmyk;
    return { ...cmykToRgb(c, m, y, k), a: 1 };
  }
 
  static rgbToCmyk(rgba: RGBA): CMYK {
    const { r, g, b, a } = rgba;
    return rgbToCmyk(r, g, b);
  }

  static rgbToHsla(rgba: RGBA): HSLA {
    const { r, g, b, a } = rgba;
    return { ...rgbToHsl(r, g, b), a };
  }

  static rgbToHsva(rgba: RGBA): HSVA {
    const { r, g, b, a } = rgba;
    return { ...rgbToHsv(r, g, b), a };
  }

  static hsvaToRgba(hsva: HSVA): RGBA {
    const { h, s, v, a } = hsva;
    return { ...hsvToRgb(h, s, v), a };
  }

  // Convert HSLA to RGBA
  static hslaToRgba(hsla: HSLA): RGBA {
    const { h, s, l, a } = hsla;
    return { ...hslToRgb(h, s, l), a };
  }

  equals(other?: NgxColor): boolean {
    if (!other) return false;
    return this.toHexString().toLowerCase() === other.toHexString().toLowerCase();
  }

  isDark(): boolean {
    const { r, g, b } = this.toRgb();
    return 0.299 * r + 0.587 * g + 0.114 * b < 128;
  }

  isLight(): boolean {
    return !this.isDark();
  }
}
