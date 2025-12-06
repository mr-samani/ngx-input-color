
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { getOffsetPosition } from '../utils/get-offset-position';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { IPosition } from '../models/IPosition';

@Component({
  selector: 'saturation',
  standalone: true,
  imports: [],
  templateUrl: './saturation.component.html',
  styleUrl: './saturation.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SaturationComponent),
      multi: true,
    },
  ],
})
export class SaturationComponent implements ControlValueAccessor {
  @Input() width?: number;
  @Input() height?: number;
  @Input() color = 'red';
  @Input() step = 1;
  @Input() min: IPosition = { x: 0, y: 0 };
  @Input() max = { x: 100, y: 100 };
  @Output() change = new EventEmitter<IPosition>();

  isDragging = false;
  @ViewChild('saturation', { static: true }) saturation!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef<HTMLDivElement>;
  x = 0;
  y = 0;
  myControl = new FormControl<IPosition | null>(null);
  isDisabled = false;
  _onChange = (value: any) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};

  private saturationRect?: DOMRect;
  private thumbRect?: DOMRect;

  constructor() {}

  private updateRects() {
    this.saturationRect = this.saturation.nativeElement.getBoundingClientRect();
    this.thumbRect = this.thumb.nativeElement.getBoundingClientRect();
  }

  writeValue(val?: IPosition | null): void {
    if (!val) val = { x: 0, y: 0 };
    let value: IPosition = val;
    this.myControl.setValue(value, { emitEvent: false });
    this.updateRects();
    const saturationRec = this.saturationRect!;
    const thumbRec = this.thumbRect!;
    this.x = ((value.x - this.min.x) * (saturationRec.width - thumbRec.width / 2)) / (this.max.x - this.min.x);
    this.y = ((value.y - this.min.y) * (saturationRec.height - thumbRec.height / 2)) / (this.max.y - this.min.y);
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
    this.updateRects();
    this.updatePosition(ev);
  }

  @HostListener('window:resize')
  onResize() {
    this.writeValue(this.myControl.value);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updatePosition(ev);
  }

  private updatePosition(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    if (!this.saturationRect || !this.thumbRect) this.updateRects();
    let position = getOffsetPosition(ev, this.saturation.nativeElement);
    let thumbRec = this.thumbRect!;
    let saturationRec = this.saturationRect!;
    if (position.x < 0) {
      this.x = 0;
    } else if (position.x > saturationRec.width - (thumbRec.width / 2 - 3)) {
      this.x = saturationRec.width - (thumbRec.width / 2 - 3);
    } else {
      this.x = position.x;
    }
    // this.x = this.x - thumbRec.width / 2;

    if (position.y < 0) {
      this.y = 0;
    } else if (position.y > saturationRec.height - (thumbRec.height / 2 - 3)) {
      this.y = saturationRec.height - (thumbRec.height / 2 - 3);
    } else {
      this.y = position.y;
    }
    //  this.y = this.y - thumbRec.height / 2;
    this.setValueByPosition(thumbRec, saturationRec);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }

  setValueByPosition(thumbRec: DOMRect, saturationRec: DOMRect) {
    const percentageX = this.x / (saturationRec.width - thumbRec.width);
    let newValueX = this.min.x + percentageX * (this.max.x - this.min.x);
    newValueX = Math.round(newValueX / this.step) * this.step;
    let valueX = Math.min(Math.max(newValueX, this.min.x), this.max.x);
    //-----------------------------
    const percentageY = this.y / (saturationRec.height - thumbRec.height);
    let newValueY = this.min.y + percentageY * (this.max.y - this.min.y);
    newValueY = Math.round(newValueY / this.step) * this.step;
    let valueY = Math.min(Math.max(newValueY, this.min.y), this.max.y);
    const newValue = { x: valueX, y: valueY };
    if (!this.myControl.value || this.myControl.value.x !== valueX || this.myControl.value.y !== valueY) {
      this.valueChanged(newValue);
    }
  }

  valueChanged(value: IPosition) {
    this.myControl.setValue(value, { emitEvent: false });
    this._onChange(value);
    this.change.emit(value);
  }
}
