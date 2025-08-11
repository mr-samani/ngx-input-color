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
  Input,
  Output,
  EventEmitter,
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
import { parseBoxShadowToPx, stringifyBoxShadow } from '../../utils/box-shadow';
import { NgxInputColorModule } from '../../ngx-input-color.module';

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
  imports: [CommonModule, FormsModule, NgxInputColorModule],
})
export class NgxBoxShadowComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  theme: 'light' | 'dark' | 'auto' = 'light';
  @Input('theme') set setTheme(val: 'light' | 'dark' | 'auto') {
    if (!val || val == 'auto') {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      this.theme = val;
    }
  }
  /**
   * The maximum range of the box shadow.
   * @default 25
   */
  @Input() maxRange = 25;
  @Output() change = new EventEmitter<string>();
  isDisabled = false;
  isDragging = false;
  value: IPosition = { x: 0, y: 0 };
  x = 0;
  y = 0;
  blur = 0;
  spread = 0;
  color = 'black';
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

  writeValue(value: any): void {
    this.resetPosition();
    if (value) {
      const boxShadow = parseBoxShadowToPx(value);
      console.log(boxShadow);
      if (boxShadow) {
        this.value = { x: boxShadow.offsetX, y: boxShadow.offsetY };
        this.blur = boxShadow.blurRadius;
        this.spread = boxShadow.spreadRadius;
        this.color = boxShadow.color;
        this.convertValueToPosition(boxShadow.offsetX, boxShadow.offsetY);
      }
    }
  }

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
    this.cd.detectChanges();
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

    // مقیاس تبدیل به -50 تا +50 (یا هرچقدر بخوای)
    const halfRangeX = (padRec.width - thumbRec.width) / 2;
    const halfRangeY = (padRec.height - thumbRec.height) / 2;

    let valueX = (dx / halfRangeX) * this.maxRange; // -50 تا +50
    let valueY = (dy / halfRangeY) * this.maxRange;

    // رُند کردن
    valueX = Math.round(valueX);
    valueY = Math.round(valueY);

    // محدود کردن به -50 تا +50 یا هر مقدار دلخواه
    valueX = Math.min(Math.max(valueX, -this.maxRange), this.maxRange);
    valueY = Math.min(Math.max(valueY, -this.maxRange), this.maxRange);

    const newValue = { x: valueX, y: valueY };

    if (!this.value || this.value.x !== valueX || this.value.y !== valueY) {
      this.value = newValue;
      this.onChangeData();
    }
  }

  public onChangeValue() {
    this.convertValueToPosition(this.value.x, this.value.y);
    this.onChangeData();
  }
  private convertValueToPosition(offsetX: number, offsetY: number) {
    if (!this.padRect || !this.thumbRect) this.updateRects();

    // موقعیت پیشنهادی بر اساس offset
    let proposedX = this.padRect!.width / 2 + offsetX - this.thumbRect!.width / 2;
    let proposedY = this.padRect!.height / 2 + offsetY - this.thumbRect!.height / 2;

    // محدود کردن (clamp) تا خارج از pad نره
    const minX = 0;
    const maxX = this.padRect!.width - this.thumbRect!.width;
    const minY = 0;
    const maxY = this.padRect!.height - this.thumbRect!.height;

    this.x = Math.min(Math.max(proposedX, minX), maxX);
    this.y = Math.min(Math.max(proposedY, minY), maxY);

    // رسم خط راهنما از مرکز به thumb
    this.line = {
      x1: this.center.x,
      y1: this.center.y,
      x2: this.x + this.thumbRect!.width / 2,
      y2: this.y + this.thumbRect!.height / 2,
    };

    this.cd.detectChanges();
  }

  onChangeData() {
    const boxShadow = stringifyBoxShadow({
      inset: false,
      offsetX: this.value.x,
      offsetY: this.value.y,
      blurRadius: this.blur,
      spreadRadius: this.spread,
      color: this.color,
    });
    this._onChange(boxShadow);
    this.change.emit(boxShadow);
  }

  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }
}
