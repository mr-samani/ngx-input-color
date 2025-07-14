import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { GradientStop, GradientType } from '@ngx-input-color/models/GradientStop';
import { NgxInputColorModule } from '@ngx-input-color/public-api';
import { RangeSliderComponent } from '@ngx-input-color/range-slider/range-slider.component';
import { buildGradientFromStops, generateRandomColor } from '@ngx-input-color/utils/build-gradient';

@Component({
  standalone: true,
  selector: 'ngx-input-gradient',
  templateUrl: './ngx-input-gradient.component.html',
  styleUrls: ['./ngx-input-gradient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputGradientComponent), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputGradientComponent,
    },
  ],
  imports: [CommonModule, FormsModule, NgxInputColorModule, RangeSliderComponent],
})
export class NgxInputGradientComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() showCloseButton = true;

  @Output() change = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  resultGradient = '';
  baseBg = '';
  rangeValues: GradientStop[] = [];
  type: GradientType = 'linear';
  rotation: number = 90;
  rotationList = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  selectedIndex = 0;

  isDisabled = false;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  @ViewChild('rangeSlider', { static: true }) rangeSlider?: RangeSliderComponent;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
  registerOnValidatorChange(fn: () => void): void {
    this._onValidateChange = fn;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.resultGradient) return { required: true };
    const parsed = this.parseGradient(this.resultGradient);
    if (!parsed.valid) return { invalid: true };
    if (parsed.stops.length < 2) return { stops: 'at least 2 color stops required' };
    return null;
  }

  private isValidGradient(value: string): boolean {
    // Accepts linear-gradient or radial-gradient with any color format
    return /^(\s*)(linear|radial)-gradient\s*\(/i.test(value);
  }

  private parseGradient(value: string): {
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
        stops.push({ color, value, id: this.generateId() });
      }
    }
    valid = stops.length >= 2;
    return { type, rotation, stops, valid };
  }

  writeValue(value: any): void {
    if (value && this.isValidGradient(value)) {
      const parsed = this.parseGradient(value);
      if (parsed.valid) {
        this.resultGradient = value;
        this.type = parsed.type;
        this.rotation = parsed.rotation;
        this.rangeValues = parsed.stops;
      } else {
        this.resultGradient = '';
        this.rangeValues = [
          { color: generateRandomColor(), value: 0, id: this.generateId() },
          { color: generateRandomColor(), value: 100, id: this.generateId() },
        ];
        this.type = 'linear';
        this.rotation = 90;
      }
    } else {
      this.resultGradient = '';
      this.rangeValues = [
        { color: generateRandomColor(), value: 0, id: this.generateId() },
        { color: generateRandomColor(), value: 100, id: this.generateId() },
      ];
      this.type = 'linear';
      this.rotation = 90;
    }
    this.generateGradient();
  }
  private generateId(): string {
    let id = 'ngx-thumb-' + Math.random().toString(36).substring(2, 9);
    if (this.rangeValues.findIndex((x) => x.id == id) >= 0) {
      return this.generateId();
    }
    return id;
  }

  close() {
    this.cancel.emit();
  }

  ok() {
    this.emitChange();
  }
  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  remove() {
    if (this.rangeValues.length > 2) {
      this.rangeValues.splice(this.selectedIndex, 1);
      this.selectedIndex = 0;
      this.generateGradient();
    }
  }

  generateGradient(ev?: string) {
    if (ev && this.rangeValues[this.selectedIndex]) {
      this.rangeValues[this.selectedIndex].color = ev;
    }
    for (let item of this.rangeValues) {
      item.color ??= generateRandomColor();
    }
    this.baseBg = buildGradientFromStops(this.rangeValues, 'linear');
    this.resultGradient = buildGradientFromStops(this.rangeValues, this.type, this.rotation);
  }

  updateRangeSlider() {
    if (this.rangeSlider) {
      this.rangeSlider.writeValue(this.rangeValues);
    }
  }
  emitChange() {
    this._onChange(this.resultGradient);
    this.change.emit(this.resultGradient);
    this.confirm.emit(this.resultGradient);
  }
}
