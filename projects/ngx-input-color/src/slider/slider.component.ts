import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  forwardRef,
  type OnInit,
} from '@angular/core';
import { getOffsetPosition } from '../utils/get-offset-position';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() step = 1;
  @Input() min = 0;
  @Input() max = 100;
  @Input() background?: string;
  @Input() isBgTransparent = false;
  @Output() change = new EventEmitter<number>();
  isDragging = false;
  @ViewChild('slider', { static: true }) slider!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef<HTMLDivElement>;
  x = 0;
  myControl = new FormControl<number | null>(null);
  isDisabled = false;
  _onChange = (value: any) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};
  constructor() {}
  ngOnInit(): void {
    this.myControl.setValidators([Validators.min(this.min), Validators.max(this.max)]);
  }

  writeValue(val?: number | string | null): void {
    let value = 0;
    if (!val) value = 0;
    else if (+val < +this.min) value = +this.min;
    else if (+val > +this.max) value = +this.max;
    else value = +val;
    this.myControl.setValue(value);
    let sliderRec = this.slider.nativeElement.getBoundingClientRect();
    let thumbRec = this.thumb.nativeElement.getBoundingClientRect();

    this.x = ((value - this.min) * (sliderRec.width - thumbRec.width)) / (this.max - this.min);
    if (val !== value) {
      this.valueChanged(value);
    }
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.myControl.errors;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(disabled: boolean): void {
    this.isDisabled = disabled;
    if (disabled) this.myControl.disable();
    else this.myControl.enable();
  }

  dragStart(ev: MouseEvent | TouchEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isDragging = true;
    this.updatePosition(ev);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updatePosition(ev);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.writeValue(this.myControl.value);
  }

  private updatePosition(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    let position = getOffsetPosition(ev, this.slider.nativeElement);
    let thumbRec = this.thumb.nativeElement.getBoundingClientRect();
    position.x -= thumbRec.width / 2;
    let sliderRec = this.slider.nativeElement.getBoundingClientRect();
    if (position.x < 0) {
      this.x = 0;
    } else if (position.x > sliderRec.width - thumbRec.width) {
      this.x = sliderRec.width - thumbRec.width;
    } else {
      this.x = position.x;
    }

    this.setValueByPosition(thumbRec, sliderRec);
  }

  setValueByPosition(thumbRec: DOMRect, sliderRec: DOMRect) {
    const percentage = this.x / (sliderRec.width - thumbRec.width);
    let newValue = this.min + percentage * (this.max - this.min);

    const stepDecimalPlaces = (this.step.toString().split('.')[1] || '').length;
    newValue = parseFloat((Math.round(newValue / this.step) * this.step).toFixed(stepDecimalPlaces));

    let value = Math.min(Math.max(newValue, this.min), this.max);
    this.valueChanged(value);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }

  valueChanged(value: number) {
    this.myControl.setValue(value);
    this._onChange(value);
    this.change.emit(value);
  }
}
