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
import { RangeSliderComponent } from '../../range-slider/range-slider.component';
import { NgxInputColorModule } from '../../ngx-input-color.module';
import { GradientStop, GradientType } from '../../models/GradientStop';
import { buildGradientFromStops, generateRandomColor, isValidGradient, parseGradient } from '../../utils/build-gradient';
import { DefaultGradients } from './default-gradients';

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

  defaultGradients: string[] = [];

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

  ngOnInit(): void {
    this.setDefaultGradients();
  }
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
    const parsed = parseGradient(this.resultGradient);
    if (!parsed.valid) return { invalid: true };
    if (parsed.stops.length < 2) return { stops: 'at least 2 color stops required' };
    return null;
  }

 

  writeValue(value: any): void {
    if (value && isValidGradient(value)) {
      const parsed = parseGradient(value);
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
    this.baseBg = buildGradientFromStops(this.rangeValues, 'linear', 90);
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

  setDefaultGradients() {
    this.defaultGradients = [];

    for (let item of DefaultGradients) {
      this.defaultGradients.push(buildGradientFromStops(item, 'linear', 90));
    }
  }

  onSelectDefault(item: string, i: number) {
    console.log('onSelectDefault', item, i);
    this.writeValue(item);
  }
}
