import { Injectable } from '@angular/core';

import { Cmyk, Rgba, Hsla, Hsva } from '../models/formats';

export class ColorHelper {
  static hsvaToRgba(hsva: Hsva): Rgba {
    const { h, s, v, a } = hsva;
    const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return new Rgba(f(5) * 255, f(3) * 255, f(1) * 255, a * 255);
  }

  // Convert HSLA to RGBA
  static hslaToRgba(hsla: Hsla): Rgba {
    const { h, s, l, a } = hsla;
    const f = (n: number, k = (n + h / 30) % 12) =>
      l - s * Math.min(l, 1 - l) * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return new Rgba(f(0) * 255, f(8) * 255, f(4) * 255, a * 255);
  }

  //--------------------------------------------------

  // Convert HEX to RGBA
  static hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
    let r = 0,
      g = 0,
      b = 0,
      a = 255;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    } else if (hex.length === 9) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
      a = parseInt(hex[7] + hex[8], 16);
    }
    return { r, g, b, a };
  }
}
