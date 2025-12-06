import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

export interface IValue {
  id?: string;
  value: number;
}
export class ValueModel {
  id!: string;
  value!: number;
  x?: number;
  thumb?: HTMLElement;
  color?: string;
}

@Component({
  selector: 'range-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true,
    },
  ],
})
export class RangeSliderComponent implements OnInit, ControlValueAccessor, Validator {
  /**
   * The step value for the slider
   */
  @Input() step = 1;
  /**
   * The minimum value for the slider
   */
  @Input() min = 0;
  /**
   * The maximum value for the slider
   */
  @Input() max = 100;
  /**
   * The background color of the slider
   * - can use css like `background: linear-gradient(to right, red, blue);`
   * - or a solid color like `background: red;`
   */
  @Input() background?: string;
  /**
   * If true, the background will be transparent
   */
  @Input() isBgTransparent = false;
  /**
   * If true, clicking on the slider will add a new range at that position
   */
  @Input() addNewRangeOnClick = false;

  /**
   * The current value of the slider
   */
  @Output() change = new EventEmitter<IValue[]>();
  @Input() selectedIndex?: number;
  @Output() selectedIndexChange = new EventEmitter<number>();

  private isDragging = false;

  @ViewChild('slider', { static: true }) slider!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: false }) thumb?: ElementRef<HTMLDivElement>;

  values: ValueModel[] = [];
  isDisabled = false;
  _onChange = (value: IValue[]) => {};
  _onTouched = () => {};
  _validatorOnChange = () => {};
  private sliderRect?: DOMRect;
  private thumbRect?: DOMRect;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit(): void {}

  private generateId(): string {
    let id = 'ngx-thumb-' + Math.random().toString(36).substring(2, 9);
    if (this.values.findIndex((x) => x.id == id) >= 0) {
      return this.generateId();
    }
    return id;
  }

  writeValue(items?: IValue[]): void {
    this.values = [];
    if (!items || !Array.isArray(items)) {
      items = [];
    }
    if (items.length === 0) {
      items.push({ id: this.generateId(), value: this.min });
    }
    for (let val of items) {
      if (typeof val.value !== 'number' || isNaN(val.value)) {
        throw new Error('RangeSliderComponent: value must be an array of numbers');
      }
      let newVal = +val.value;
      if (newVal < +this.min) newVal = +this.min;
      else if (newVal > +this.max) newVal = +this.max;
      this.values.push({
        ...val,
        id: val.id ?? this.generateId(),
        value: newVal,
      });
    }
    this.updateAllThumbPositions();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return null; // TODO: return errors if any;
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
  }
  private updateRects() {
    this.sliderRect = this.slider.nativeElement.getBoundingClientRect();
    if (this.thumb) {
      this.thumbRect = this.thumb.nativeElement.getBoundingClientRect();
    }
  }
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updateThumbPosition(ev);
  }

  @HostListener('window:resize')
  onResize() {
    this.writeValue(this.values);
  }
  dragStart(ev: MouseEvent | TouchEvent, index: number) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isDragging = true;
    this.selectedIndex = index;
    this.updateRects();
    this.updateThumbPosition(ev);
    this.selectedIndexChange.emit(this.selectedIndex);
  }

  addnewRangeOnSliderClick(event: MouseEvent | TouchEvent) {
    if (!this.addNewRangeOnClick) return;
    const position = getOffsetPosition(event, this.slider.nativeElement);
    const newValue = this.min + (position.x / this.sliderRect!.width) * (this.max - this.min);
    // must be add with order by position
    const indexByOrderValue = this.values.findIndex((item) => item.value > newValue);
    const insertIndex = indexByOrderValue >= 0 ? indexByOrderValue : this.values.length;
    this.values.splice(insertIndex, 0, {
      id: this.generateId(),
      value: newValue,
    });
    this.dragStart(event, insertIndex);
    // this.updateAllThumbPositions();
    // this.valueChanged();
  }

  private updateThumbPosition(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging || this.selectedIndex == undefined) return;
    if (!this.sliderRect || !this.thumbRect) this.updateRects();
    let position = getOffsetPosition(ev, this.slider.nativeElement);
    let thumbRec = this.thumbRect!;
    position.x -= thumbRec.width / 2;
    let sliderRec = this.sliderRect!;
    const thumb = this.values[this.selectedIndex];
    if (position.x < 0) {
      thumb.x = 0;
    } else if (position.x > sliderRec.width - thumbRec.width) {
      thumb.x = sliderRec.width - thumbRec.width;
    } else {
      thumb.x = position.x;
    }
    this.setValueByPosition(thumb, thumbRec, sliderRec);
  }

  updateAllThumbPositions() {
    // wait to add thumbs
    setTimeout(() => {
      this.updateRects();
      const sliderRec = this.sliderRect!;
      const thumbRec = this.thumbRect!;
      for (let item of this.values) {
        item.x = ((item.value - this.min) * (sliderRec.width - thumbRec.width)) / (this.max - this.min);
      }
      this.changeDetectorRef.detectChanges();
    });
  }
  setValueByPosition(thumb: ValueModel, thumbRec: DOMRect, sliderRec: DOMRect) {
    const percentage = (thumb.x ?? 0) / (sliderRec.width - thumbRec.width);
    let newValue = this.min + percentage * (this.max - this.min);
    const stepDecimalPlaces = (this.step.toString().split('.')[1] || '').length;
    newValue = parseFloat((Math.round(newValue / this.step) * this.step).toFixed(stepDecimalPlaces));
    let value = Math.min(Math.max(newValue, this.min), this.max);
    if (thumb.value !== value) {
      thumb.value = value;
      this.valueChanged();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
    // this.selectedIndex = undefined;
  }

  valueChanged() {
    const v = this.values; // this.values.map(({ x, thumb, ...rest }) => ({ ...rest }));
    this._onChange(v);
    this.change.emit(v);
  }
}
