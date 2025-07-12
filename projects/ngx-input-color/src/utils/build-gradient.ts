import { GradientStop, GradientType } from '@ngx-input-color/models/GradientStop';

export function buildGradientFromStops(stops: GradientStop[], type: GradientType = 'linear', rotation = 0): string {
  if (!stops || stops.length === 0) return '';

  // مرتب‌سازی بر اساس مقدار شروع
  const sorted = [...stops].sort((a, b) => a.value - b.value);

  const parts: string[] = [];

  for (const stop of sorted) {
    const start = Math.max(0, Math.min(stop.value, 100));
    const end = Math.max(start, Math.min(start, 100));
    parts.push(`${stop.color} ${start}%`, `${stop.color} ${end}%`);
  }

  let f = '';
  if (type == 'linear') {
    f = rotation > 0 ? rotation + 'deg, ' : 'to right, ';
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
