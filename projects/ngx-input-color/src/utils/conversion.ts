import { CMYK, HSL, HSLA, HSV, HSVA, RGB, RGBA } from './interfaces';

export function hexToRgb(hex: string): RGBA {
  let h = hex.replace(/^#/, '');
  if (h.length === 3)
    h = h
      .split('')
      .map((x) => x + x)
      .join('');
  if (h.length === 6) h += 'ff';
  if (h.length === 8) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = parseInt(h.slice(6, 8), 16) / 255;
    return { r, g, b, a: a };
  }
  throw new Error('Invalid hex color');
}
export function parseRgbString(str: string): RGBA {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error('Invalid rgb string');
  const parts = m[1].split(',').map((x) => +x.trim());
  return {
    r: parts[0],
    g: parts[1],
    b: parts[2],
    a: parts[3] !== undefined ? parts[3] : 1,
  };
}
export function parseHslString(str: string): HSLA {
  const m = str.match(/hsla?\(([^)]+)\)/);
  if (!m) throw new Error('Invalid hsl string');
  const parts = m[1].split(',').map((x) => +x.trim());
  return {
    h: (parts[0], 0, 360),
    s: (parts[1], 0, 100),
    l: (parts[2], 0, 100),
    a: parts[3] !== undefined ? parts[3] : 1,
  };
}
export function parseHsvString(str: string): HSVA {
  const m = str.match(/hsva?\(([^)]+)\)/);
  if (!m) throw new Error('Invalid hsv string');
  const parts = m[1].split(',').map((x) => +x.trim());
  return {
    h: (parts[0], 0, 360),
    s: (parts[1], 0, 100),
    v: (parts[2], 0, 100),
    a: parts[3] !== undefined ? parts[3] : 1,
  };
}
export function parseCmykString(str: string): CMYK {
  const m = str.match(/cmyk\(([^)]+)\)/);
  if (!m) throw new Error('Invalid cmyk string');
  const parts = m[1].split(',').map((x) => +x.trim());
  return {
    c: (parts[0], 0, 100),
    m: (parts[1], 0, 100),
    y: (parts[2], 0, 100),
    k: (parts[3], 0, 100),
  };
}

/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
export function bound01(n: any, max: number): number {
  if (isOnePointZero(n)) {
    n = '100%';
  }

  const isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = (n % max) / parseFloat(String(max));
  }

  return n;
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
export function isOnePointZero(n: string | number): boolean {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}

/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
export function isPercentage(n: string | number): boolean {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * convert all properties in an interface to a number
 */
export type Numberify<T> = {
  [P in keyof T]: number;
};

/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
export function convertToPercentage(n: number | string): number | string {
  if (Number(n) <= 1) {
    return `${Number(n) * 100}%`;
  }

  return n;
}

/**
 * Force a hex value to have 2 characters
 * @hidden
 */
export function pad2(c: string): string {
  return c.length === 1 ? '0' + c : String(c);
}

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
export function rgbToRgb(r: number | string, g: number | string, b: number | string): Numberify<RGB> {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255,
  };
}

/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255]
 * *Returns:* { h: 0-360, s: 0-100, l: 0-100 }
 */
export function rgbToHsl(r: number, g: number, b: number): Numberify<HSL> {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = (h * 360) % 360;
  if (h < 0) h += 360;
  return {
    h: max === min ? 0 : h,
    s: l === 0 || l === 1 ? 0 : s * 100,
    l: l * 100
  };
}

/**
 * Converts an HSL color value to RGB.
 * *Assumes:* h in [0, 360], s and l in [0, 100]
 * *Returns:* { r, g, b } in [0, 255]
 */
export function hslToRgb(h: number | string, s: number | string, l: number | string): Numberify<RGB> {
  h = +h;
  s = +s;
  l = +l;
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

/**
 * Converts an RGB color value to HSV
 * *Assumes:* r, g, and b are contained in [0, 255]
 * *Returns:* { h: 0-360, s: 0-100, v: 0-100 }
 */
export function rgbToHsv(r: number, g: number, b: number): Numberify<HSV> {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = (h * 360) % 360;
  if (h < 0) h += 360;
  return {
    h: max === min ? 0 : h,
    s: max === 0 ? 0 : s * 100,
    v: v * 100
  };
}

/**
 * Converts an HSV color value to RGB.
 * *Assumes:* h in [0, 360], s and v in [0, 100]
 * *Returns:* { r, g, b } in [0, 255]
 */
export function hsvToRgb(h: number | string, s: number | string, v: number | string): Numberify<RGB> {
  h = +h;
  s = +s;
  v = +v;
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));
  s = s / 100;
  v = v / 100;
  let r = 0, g = 0, b = 0;
  const hi = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (hi) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
  }
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

/**
 * Converts an RGB color to hex
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255]
 * *Returns:* a 3 or 6 character hex
 */
export function rgbToHex(r: number, g: number, b: number, allow3Char: boolean): string {
  const hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];

  // Return a 3 character hex if possible
  if (
    allow3Char &&
    hex[0].startsWith(hex[0].charAt(1)) &&
    hex[1].startsWith(hex[1].charAt(1)) &&
    hex[2].startsWith(hex[2].charAt(1))
  ) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }

  return hex.join('');
}

/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
 * *Returns:* a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
export function rgbaToHex(r: number, g: number, b: number, a: number, allow4Char: boolean): string {
  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a)),
  ];

  // Return a 4 character hex if possible
  if (
    allow4Char &&
    hex[0].startsWith(hex[0].charAt(1)) &&
    hex[1].startsWith(hex[1].charAt(1)) &&
    hex[2].startsWith(hex[2].charAt(1)) &&
    hex[3].startsWith(hex[3].charAt(1))
  ) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }

  return hex.join('');
}

/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"
 *
 * *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
 * *Returns:* a 8 character argb hex
 */
export function rgbaToArgbHex(r: number, g: number, b: number, a: number): string {
  const hex = [
    pad2(convertDecimalToHex(a)),
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
  ];

  return hex.join('');
}

/**
 * Converts CMYK to RBG
 * Assumes c, m, y, k are in the set [0, 100]
 */
export function cmykToRgb(c: number, m: number, y: number, k: number) {
  const cConv = c / 100;
  const mConv = m / 100;
  const yConv = y / 100;
  const kConv = k / 100;

  const r = 255 * (1 - cConv) * (1 - kConv);
  const g = 255 * (1 - mConv) * (1 - kConv);
  const b = 255 * (1 - yConv) * (1 - kConv);

  return { r, g, b };
}

export function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, m, y);

  if (k === 1) {
    c = 0;
    m = 0;
    y = 0;
  } else {
    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
  }

  k *= 100;

  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k),
  };
}

/** Converts a decimal to a hex value */
export function convertDecimalToHex(d: string | number): string {
  return Math.round(parseFloat(d as string) * 255).toString(16);
}

/** Converts a hex value to a decimal */
export function convertHexToDecimal(h: string): number {
  return parseIntFromHex(h) / 255;
}

/** Parse a base-16 hex value into a base-10 integer */
export function parseIntFromHex(val: string): number {
  return parseInt(val, 16);
}

export function numberInputToObject(color: number): RGB {
  return {
    r: color >> 16,
    g: (color & 0xff00) >> 8,
    b: color & 0xff,
  };
}
