import { NgxColor } from './color-helper';
import { RGBA, HSLA, HSVA, CMYK } from './interfaces';

function expectColorCloseTo(actual: any, expected: any, precision = 0) {
  for (const key of Object.keys(expected)) {
    if (typeof expected[key] === 'number') {
      expect(actual[key]).toBeCloseTo(expected[key], precision);
    } else {
      expect(actual[key]).toEqual(expected[key]);
    }
  }
}

describe('NgxColor', () => {
  it('should construct from RGB object', () => {
    const c = new NgxColor({ r: 255, g: 0, b: 0, a: 1 });
    expect(c.toHexString()).toBe('#ff0000');
    expectColorCloseTo(c.toRgb(), { r: 255, g: 0, b: 0, a: 1 });
  });

  it('should construct from HSL object', () => {
    const c = new NgxColor({ h: 120, s: 100, l: 50, a: 1 });
    expect(c.toHexString()).toBe('#00ff00');
    expectColorCloseTo(c.toHsl(), { h: 120, s: 100, l: 50, a: 1 });
  });

  it('should construct from HSV object', () => {
    const c = new NgxColor({ h: 240, s: 100, v: 100, a: 1 });
    expect(c.toHexString()).toBe('#0000ff');
    expectColorCloseTo(c.toHsv(), { h: 240, s: 100, v: 100, a: 1 });
  });

  it('should construct from CMYK object', () => {
    const c = new NgxColor({ c: 0, m: 100, y: 100, k: 0 });
    expect(c.toHexString()).toBe('#ff0000');
    expectColorCloseTo(c.toCmyk(), { c: 0, m: 100, y: 100, k: 0 });
  });

  it('should construct from hex string', () => {
    const c = new NgxColor('#00ff00');
    expectColorCloseTo(c.toRgb(), { r: 0, g: 255, b: 0, a: 1 });
    expect(c.toHexString()).toBe('#00ff00');
  });

  it('should construct from rgb string', () => {
    const c = new NgxColor('rgb(0,0,255)');
    expect(c.toHexString()).toBe('#0000ff');
    expectColorCloseTo(c.toRgb(), { r: 0, g: 0, b: 255, a: 1 });
  });

  it('should construct from rgba string', () => {
    const c = new NgxColor('rgba(255,0,0,0.5)');
    expectColorCloseTo(c.toRgb(), { r: 255, g: 0, b: 0, a: 0.5 });
    expect(c.toHexString()).toBe('#ff000080');
  });

  it('should construct from hsl string', () => {
    const c = new NgxColor('hsl(120,100,50)');
    expect(c.toHexString()).toBe('#00ff00');
    expect(c.toHsl().h).toBeCloseTo(120);
  });

  it('should construct from hsla string', () => {
    const c = new NgxColor('hsla(240,100,50,0.5)');
    expect(c.toRgb().a).toBeCloseTo(0.5);
    expect(c.toHexString()).toBe('#0000ff80');
  });

  it('should construct from hsv string', () => {
    const c = new NgxColor('hsv(60,100,100)');
    expect(c.toHexString()).toBe('#ffff00');
    expect(c.toHsv().h).toBeCloseTo(60);
  });

  it('should construct from hsva string', () => {
    const c = new NgxColor('hsva(60,100,100,0.5)');
    expect(c.toRgb().a).toBeCloseTo(0.5);
    expect(c.toHexString()).toBe('#ffff0080');
  });

  it('should construct from cmyk string', () => {
    const c = new NgxColor('cmyk(0,0,0,0)');
    expect(c.toHexString()).toBe('#ffffff');
    expectColorCloseTo(c.toCmyk(), { c: 0, m: 0, y: 0, k: 0 });
  });

  it('should construct from named color', () => {
    const c = new NgxColor('red');
    expect(c.toHexString()).toBe('#ff0000');
    expect(c.toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('should detect dark and light', () => {
    expect(new NgxColor('black').isDark()).toBe(true);
    expect(new NgxColor('white').isLight()).toBe(true);
  });

  it('should compare equality', () => {
    const a = new NgxColor('rgba(255,0,0,1)');
    const b = new NgxColor('#ff0000');
    expect(a.equals(b)).toBe(true);
  });

  it('should handle invalid input', () => {
    expect(() => new NgxColor('notacolor')).toThrow();
  });
});
