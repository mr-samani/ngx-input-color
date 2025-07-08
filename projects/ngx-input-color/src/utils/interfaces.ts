/**
 * A representation of additive color mixing.
 * Projection of primary color lights on a white screen shows secondary
 * colors where two overlap; the combination of all three of red, green,
 * and blue in equal intensities makes white.
 */
export class RGB {
  r!: number;
  g!: number;
  b!: number;
}

export class RGBA extends RGB {
  a!: number;
}

/**
 * The HSL model describes colors in terms of hue, saturation,
 * and lightness (also called luminance).
 * @link https://en.wikibooks.org/wiki/Color_Models:_RGB,_HSV,_HSL#HSL
 */
export class HSL {
  h!: number;
  s!: number;
  l!: number;
}

export class HSLA extends HSL {
  a!: number;
}

/**
 * The HSV, or HSB, model describes colors in terms of
 * hue, saturation, and value (brightness).
 * @link https://en.wikibooks.org/wiki/Color_Models:_RGB,_HSV,_HSL#HSV
 */
export class HSV {
  h!: number;
  s!: number;
  v!: number;
}

export class HSVA extends HSV {
  a!: number;
}

/**
 * The CMYK color model is a subtractive color model used in the printing process.
 * It described four ink palettes: Cyan, Magenta, Yellow, and Black.
 * @link https://en.wikipedia.org/wiki/CMYK_color_model
 */
export class CMYK {
  c!: number;
  m!: number;
  y!: number;
  k!: number;
}
