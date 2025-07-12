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
  encapsulation: ViewEncapsulation.None,
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
    return null;
  }

  writeValue(value: any): void {
    if (value) {
      this.resultGradient = value;
      this.rangeValues = [];
    } else {
      this.resultGradient = '';
      this.rangeValues = [
        { color: generateRandomColor(), value: 0, id: this.generateId() },
        { color: generateRandomColor(), value: 100, id: this.generateId() },
      ];
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
      this.generateGradient();
    }
  }

  generateGradient() {
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
