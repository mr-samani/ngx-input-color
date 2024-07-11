import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { getOffsetPosition } from '../helper/get-offset-position';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lib-slider',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="slider-container">
      <ng-content></ng-content>{{ x }}
      <div
        #slider
        class="slider"
        (mousedown)="dragStart($event)"
        (touchstart)="dragStart($event)"
      >
        <div class="thumb" #thumb [style.left.px]="x"></div>
      </div>
    </div>
    {{ myControl.value }}`,
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input() step = 1;
  @Input() min = 0;
  @Input() max = 100;

  isDragging = false;
  @ViewChild('slider', { static: true }) slider!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef<HTMLDivElement>;
  x = 0;
  myControl = new FormControl<number | null>(null, [
    Validators.min(this.min),
    Validators.max(this.max),
  ]);
  isDisabled = false;
  _onChange = (value: any) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};
  constructor() {}
  ngOnInit(): void {}

  writeValue(val: any): void {
    this.myControl.setValue(val);
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

  private updatePosition(ev: MouseEvent | TouchEvent) {
    let position = getOffsetPosition(ev, this.slider.nativeElement);
    let thumbRec = this.thumb.nativeElement.getBoundingClientRect();
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
    const percentage = (this.x + thumbRec.width / 2) / sliderRec.width;
    let newValue = this.min + percentage * (this.max - this.min);
    newValue = Math.round(newValue / this.step) * this.step;
    let value = Math.min(Math.max(newValue, this.min), this.max);
    this._onChange(value);
    this.myControl.setValue(value);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }
}
