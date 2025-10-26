// gradient-utils.ts
import { GradientStop, GradientType } from '../models/GradientStop';

export function buildGradientFromStops(
  stops: GradientStop[],
  type: GradientType = 'linear',
  rotation: number | string = 0
): string {
  if (!stops || stops.length === 0) return '';

  // sort by numeric value
  const sorted = [...stops].sort((a, b) => a.value - b.value);

  // clamp 0..100 and format stops
  const parts = sorted.map((s) => {
    const v = Math.max(0, Math.min(Number(s.value) || 0, 100));
    return `${s.color.trim()} ${v}%`;
  });

  let prefix = '';
  if (type === 'linear') {
    // rotation can be number (deg) or string like 'to right' or '45deg'
    if (typeof rotation === 'number') prefix = `${rotation}deg, `;
    else if (typeof rotation === 'string' && rotation.trim().length) prefix = `${rotation.trim()}, `;
  } else if (type === 'radial') {
    // keep simple "circle" default: caller may put 'circle' in rotation (or pass separate option if needed)
    prefix = typeof rotation === 'string' && rotation.trim() ? `${rotation.trim()}, ` : 'circle, ';
  } else if (type === 'conic') {
    // conic-gradient accepts angle like 'from 45deg at 50% 50%'
    if (typeof rotation === 'number') prefix = `from ${rotation}deg, `;
    else if (typeof rotation === 'string' && rotation.trim()) prefix = `${rotation.trim()}, `;
  }

  return `${type}-gradient(${prefix}${parts.join(', ')})`;
}

export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function isValidGradient(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^\s*(conic|linear|radial)-gradient\s*\(/i.test(value.trim());
}

/**
 * parseGradient
 * - returns: { type, rotation (number|string), stops, valid }
 * - stops: array of { id, color, value } where value is 0..100 (percent)
 * - rotation: number (deg) for linear if parsed as angle, or string (e.g. 'to right' or '45deg')
 */
export function parseGradient(value: string): {
  type: GradientType;
  rotation: number;
  shape?: string;
  stops: GradientStop[];
  valid: boolean;
} {
  let type: GradientType = 'linear';
  let rotation = 90;
  let shape: string | undefined;
  let stops: GradientStop[] = [];
  let valid = false;

  if (!value) return { type, rotation, shape, stops, valid };

  const match = value.trim().match(/^(\s*)(conic|linear|radial)-gradient\s*\((.*)\)$/i);
  if (!match) return { type, rotation, shape, stops, valid };

  type = match[2].toLowerCase() as GradientType;
  let content = match[3].trim();

  // --- Split arguments by commas, respecting parentheses (for rgba, hsl, etc.)
  const parts: string[] = [];
  let buf = '';
  let depth = 0;
  for (const c of content) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) {
      parts.push(buf.trim());
      buf = '';
    } else {
      buf += c;
    }
  }
  if (buf.trim()) parts.push(buf.trim());

  // --- Determine starting index for color stops
  let colorStopStart = 0;
  const first = parts[0];

  if (type === 'linear') {
    // e.g., "90deg" or "to right"
    const angleMatch = first.match(/^(\d+)(deg)?$/i);
    if (angleMatch) {
      rotation = parseFloat(angleMatch[1]);
      colorStopStart = 1;
    } else if (/^to /i.test(first)) {
      // optional direction mapping
      colorStopStart = 1;
    }
  } else if (type === 'radial') {
    // e.g., "circle", "circle at center", "ellipse at top left"
    if (!/^#|rgb|hsl|[a-z]+\(/i.test(first)) {
      shape = first;
      colorStopStart = 1;
    }
  } else if (type === 'conic') {
    // e.g., "from 0deg at center"
    if (!/^#|rgb|hsl|[a-z]+\(/i.test(first)) colorStopStart = 1;
  }

  // --- Regex for color stops
  const colorStopRegex = /((#([0-9a-fA-F]{3,8}))|(rgba?\([^\)]+\))|(hsla?\([^\)]+\))|([a-zA-Z]+))(\s+([\d.]+%?))?/;

  for (let i = colorStopStart; i < parts.length; i++) {
    const stopPart = parts[i].trim();
    const m = stopPart.match(colorStopRegex);
    if (m) {
      const color = m[1];
      const posStr = m[9];
      let value = 0;
      if (posStr && posStr.endsWith('%')) value = parseFloat(posStr);
      else if (posStr) value = parseFloat(posStr);
      else {
        // اگر درصدی وجود نداشت، با توجه به ایندکس مقدار دهی کن
        if (stops.length === 0) value = 0;
        else if (i === parts.length - 1) value = 100;
        else value = (100 / (parts.length - colorStopStart - 1)) * stops.length;
      }

      stops.push({ color, value, id: generateId(stops) });
    }
  }

  valid = stops.length >= 2;
  return { type, rotation, shape, stops, valid };
}

function generateId(rangeValues: GradientStop[]): string {
  const id = 'ngx-stop-' + Math.random().toString(36).substring(2, 9);
  return rangeValues.find((x) => x.id === id) ? generateId(rangeValues) : id;
}
