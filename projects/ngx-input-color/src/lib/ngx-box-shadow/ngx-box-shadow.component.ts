import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormsModule,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { getOffsetPosition } from '../../utils/get-offset-position';
import { IPosition } from '../../models/IPosition';

@Component({
  standalone: true,
  selector: 'ngx-box-shadow',
  templateUrl: './ngx-box-shadow.component.html',
  styleUrls: ['./ngx-box-shadow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxBoxShadowComponent), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxBoxShadowComponent,
    },
  ],
  imports: [CommonModule, FormsModule],
})
export class NgxBoxShadowComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  isDisabled = false;
  isDragging = false;
  value: IPosition = { x: 0, y: 0 };
  x = 0;
  y = 0;
  line: { x1: number; y1: number; x2: number; y2: number } = { x1: 0, y1: 0, x2: 0, y2: 0 };
  center: { x: number; y: number } = { x: 0, y: 0 };

  padRect?: DOMRect;
  thumbRect?: DOMRect;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  @ViewChild('pad', { static: true }) pad!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef<HTMLDivElement>;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.updateRects();
    this.resetPosition();
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
    return null;
  }

  writeValue(value: any): void {}

  dragStart(ev: MouseEvent | TouchEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isDragging = true;
    this.updatePosition(ev);
    this.updateRects();
  }
  private updateRects() {
    this.padRect = this.pad.nativeElement.getBoundingClientRect();
    this.thumbRect = this.thumb.nativeElement.getBoundingClientRect();
  }
  private resetPosition() {
    if (!this.padRect || !this.thumbRect) this.updateRects();
    this.center = { x: this.padRect!.width / 2, y: this.padRect!.height / 2 };
    this.x = this.center.x - this.thumbRect!.width / 2;
    this.y = this.center.y - this.thumbRect!.height / 2;
    this.line = { x1: this.center.x, y1: this.center.y, x2: this.center.x, y2: this.center.y };
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.writeValue(this.value);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updatePosition(ev);
  }

  private updatePosition(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    if (!this.padRect || !this.thumbRect) this.updateRects();
    const position = getOffsetPosition(ev, this.pad.nativeElement);

    const padRec = this.padRect!;
    const thumbRec = this.thumbRect!;

    const minX = thumbRec.width / 2;
    const maxX = padRec.width - thumbRec.width / 2;
    const minY = thumbRec.height / 2;
    const maxY = padRec.height - thumbRec.height / 2;

    const clampedX = Math.max(minX, Math.min(position.x, maxX));
    const clampedY = Math.max(minY, Math.min(position.y, maxY));

    // فقط یکبار از وسط اصلاح کن
    this.x = clampedX - thumbRec.width / 2;
    this.y = clampedY - thumbRec.height / 2;

    this.line = {
      x1: this.center.x,
      y1: this.center.y,
      x2: this.x + thumbRec.width / 2,
      y2: this.y + thumbRec.height / 2,
    };

    this.setValueByPosition(thumbRec, padRec);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }

  setValueByPosition(thumbRec: DOMRect, padRec: DOMRect) {
    const padCenterX = (padRec.width - thumbRec.width) / 2;
    const padCenterY = (padRec.height - thumbRec.height) / 2;

    // فاصله thumb از مرکز
    const dx = this.x - padCenterX;
    const dy = this.y - padCenterY;

    // مقیاس تبدیل به -100 تا +100 (یا هرچقدر بخوای)
    const halfRangeX = (padRec.width - thumbRec.width) / 2;
    const halfRangeY = (padRec.height - thumbRec.height) / 2;

    let valueX = (dx / halfRangeX) * 100; // -100 تا +100
    let valueY = (dy / halfRangeY) * 100;

    // رُند کردن
    valueX = Math.round(valueX);
    valueY = Math.round(valueY);

    // محدود کردن به -100 تا +100 یا هر مقدار دلخواه
    valueX = Math.min(Math.max(valueX, -100), 100);
    valueY = Math.min(Math.max(valueY, -100), 100);

    const newValue = { x: valueX, y: valueY };

    if (!this.value || this.value.x !== valueX || this.value.y !== valueY) {
      this.valueChanged(newValue);
    }
  }

  valueChanged(value: IPosition) {
    this.value = value;
    this._onChange('todo');
  }
}
