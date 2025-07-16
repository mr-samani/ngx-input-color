import { GradientStop, GradientType } from '../models/GradientStop';

export function buildGradientFromStops(stops: GradientStop[], type: GradientType = 'linear', rotation = 0): string {
  if (!stops || stops.length === 0) return '';

  const sorted = [...stops].sort((a, b) => a.value - b.value);

  const parts: string[] = [];

  for (const stop of sorted) {
    const value = Math.max(0, Math.min(stop.value, 100));
    parts.push(`${stop.color} ${value}%`);
  }

  let f = '';
  if (type === 'linear') {
    f = `${rotation}deg, `;
  } else {
    f = 'circle, ';
  }

  return `${type}-gradient(${f}${parts.join(', ')})`;
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
  // Accepts linear-gradient or radial-gradient with any color format
  return /^(\s*)(linear|radial)-gradient\s*\(/i.test(value);
}

export function parseGradient(value: string): {
  type: GradientType;
  rotation: number;
  stops: GradientStop[];
  valid: boolean;
} {
  let type: GradientType = 'linear';
  let rotation = 90;
  let stops: GradientStop[] = [];
  let valid = false;
  let match = value.match(/^(\s*)(linear|radial)-gradient\s*\((.*)\)$/i);
  if (!match) return { type, rotation, stops, valid };
  type = match[2] as GradientType;
  let content = match[3];
  // Split by commas, but ignore commas inside parentheses (for rgb, hsl, etc)
  let parts = [];
  let buf = '',
    depth = 0;
  for (let c of content) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) {
      parts.push(buf.trim());
      buf = '';
    } else {
      buf += c;
    }
  }
  if (buf) parts.push(buf.trim());
  // First part may be angle/direction (for linear) or shape/position (for radial)
  let first = parts[0];
  let colorStopStart = 0;
  if (type === 'linear') {
    let angleMatch = first.match(/^(\d+)(deg)?$/i);
    if (angleMatch) {
      rotation = parseInt(angleMatch[1], 10);
      colorStopStart = 1;
    } else if (/to /.test(first)) {
      // e.g. 'to right', 'to bottom left' (optional: map to degree)
      // You can add mapping if needed
      colorStopStart = 1;
    }
  } else if (type === 'radial') {
    // e.g. 'circle at center', 'ellipse at top left', etc
    if (!/^(#|rgb|hsl|[a-z])/i.test(first)) colorStopStart = 1;
  }
  // Color stop regex: supports hex, rgb(a), hsl(a), color names, with optional position
  const colorStopRegex =
    /((#([0-9a-fA-F]{3,8}))|(rgba?\([^\)]+\))|(hsla?\([^\)]+\))|([a-zA-Z]+))(\s+([\d.]+%?|[\d.]+px|[\d.]+em))?/;
  for (let i = colorStopStart; i < parts.length; i++) {
    let stopPart = parts[i];
    let m = stopPart.match(colorStopRegex);
    if (m) {
      let color = m[1];
      let posStr = m[8];
      let value = 0;
      if (posStr) {
        if (posStr.endsWith('%')) value = parseFloat(posStr);
        else value = parseFloat(posStr); // px/em: you may want to normalize or keep as is
      } else {
        value = i === colorStopStart ? 0 : 100;
      }
      stops.push({ color, value, id: generateId(stops) });
    }
  }
  valid = stops.length >= 2;
  return { type, rotation, stops, valid };
}
function generateId(rangeValues: GradientStop[]): string {
  let id = 'ngx-thumb-' + Math.random().toString(36).substring(2, 9);
  if (rangeValues.findIndex((x) => x.id == id) >= 0) {
    return generateId(rangeValues);
  }
  return id;
}
