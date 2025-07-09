export interface GradientStop {
  id: string;
  value: number; // مثلا 23 (موقعیت شروع رنگ)
  rotation: number; // مثلا 10 (درصدی که رنگ ادامه داره)
  color: string; // مثل 'red' یا '#ff0000'
}

export type GradientType = 'linear' | 'radial';
