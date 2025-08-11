import { BoxShadowValue } from '../models/BoxShadowValue';
export function parseBoxShadowToPx(shadow: string, contextPx = 16): BoxShadowValue | null {
  if (!shadow?.trim()) return null;
  let inset = false;
  shadow = shadow.trim();

  if (shadow.startsWith('inset')) {
    inset = true;
    shadow = shadow.slice(5).trim();
  }

  const colorRegex =
    /(#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{4}|[a-f0-9]{8})\b|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*\d*(?:\.\d+)?\)|hsl\(\s*\d+,\s*\d*(?:\.\d+)?%,\s*\d*(?:\.\d+)?%\)|hsla\(\d+,\s*[\d.]+%,\s*[\d.]+%,\s*\d*(?:\.\d+)?\))/gi;
  const colorMatch = shadow.match(colorRegex);
  let color = 'black';
  if (colorMatch) {
    color = colorMatch[0];
    shadow = shadow.replace(color, '').trim();
  }

  const toPx = (value: number, unit: string): number => {
    switch (unit.toLowerCase()) {
      case 'px':
      case '':
        return value;
      case 'em':
      case 'rem':
        return value * contextPx;
      case '%':
        return (value / 100) * contextPx;
      case 'pt':
        return value * 1.333;
      default:
        return value; // fallback
    }
  };

  const matches = [...shadow.matchAll(/(-?\d*\.?\d+)([a-zA-Z%]*)/g)];
  const values = matches.map(([_, num, unit]) => toPx(parseFloat(num), unit));

  const [offsetX, offsetY, blur, spread] = values;

  return {
    inset,
    offsetX: offsetX ?? 0,
    offsetY: offsetY ?? 0,
    blurRadius: blur ?? 0,
    spreadRadius: spread ?? 0,
    color,
  };
}

export function stringifyBoxShadow(obj: BoxShadowValue): string {
  const { inset, offsetX, offsetY, blurRadius, spreadRadius, color } = obj;

  const parts = [inset ? 'inset' : '', `${offsetX}px`, `${offsetY}px`, `${blurRadius}px`, `${spreadRadius}px`, color];

  return parts.filter(Boolean).join(' ').trim();
}
