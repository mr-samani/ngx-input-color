import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
  signal,
  effect,
  DestroyRef,
  WritableSignal,
  forwardRef,
  ChangeDetectionStrategy,
  input,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrowserService } from 'ngx-input-color/shared';
import { Subject, fromEvent, merge, tap, map, filter, switchMap, takeUntil, repeat } from 'rxjs';

@Component({
  selector: 'ngx-input-angle',
  templateUrl: './input-angle.component.html',
  styleUrls: ['./input-angle.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxAngleSelectorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.dark]': 'theme=="dark"',
    '[style.--ngx-size]': 'size()+"px"',
  },
})
export class NgxAngleSelectorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  browserService = inject(BrowserService);
  theme: 'light' | 'dark' = this.browserService.prefersDarkMode ? 'dark' : 'light';
  @Input('theme') set setTheme(val: 'light' | 'dark' | 'auto') {
    if (!val || val == 'auto') {
      this.theme = this.browserService.prefersDarkMode ? 'dark' : 'light';
    } else {
      this.theme = val;
    }
  }
  size = input<number>(90);
  private minAngle = signal<number>(0);
  private maxAngle = signal<number>(360);

  isDisabled = signal(false);

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  @ViewChild('selectorContainer') selectorContainer!: ElementRef<HTMLDivElement>;
  currentAngle = signal(0);
  isDragging = signal(false);
  selectorRect: DOMRect | null = null;
  centerX: number = 0;
  centerY: number = 0;

  tickes: number[] = [];
  private pointerDownSubject = new Subject<PointerEvent>();
  private pointerMoveSubject = new Subject<PointerEvent>();
  private pointerUpSubject = new Subject<PointerEvent>();

  private destroyRef = inject(DestroyRef);

  chdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
    // const clampedInitial = this.clamp(this.initialAngle(), this.minAngle(), this.maxAngle());
    // this.currentAngle.set(clampedInitial);
  }

  ngAfterViewInit(): void {
    this.updateSelectorDimensions();
    this.drawTicks();
    this.setupPointerEvents();
  }

  writeValue(value: number | null | undefined): void {
    if (value !== null && value != undefined) {
      const clampedValue = this.clamp(+value, this.minAngle(), this.maxAngle());
      this.currentAngle.set(clampedValue);
    }
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  private updateSelectorDimensions(): void {
    const containerElement = this.selectorContainer.nativeElement;
    this.selectorRect = containerElement.getBoundingClientRect();
    this.centerX = this.selectorRect.left + this.selectorRect.width / 2;
    this.centerY = this.selectorRect.top + this.selectorRect.height / 2;
  }
  selectorSize() {
    return this.selectorRect?.width ?? 300;
  }

  private drawTicks(): void {
    const containerElement = this.selectorContainer.nativeElement;

    containerElement.querySelectorAll('.tick').forEach((tick: any) => tick.remove());

    const numTicks = 8;
    const tickInterval = 360 / numTicks;
    this.tickes = [];
    for (let i = 0; i < numTicks; i++) {
      const angle = i * tickInterval;
      this.tickes.push(angle);
    }
    this.chdr.detectChanges();
  }

  private calculateAngle(event: PointerEvent): void {
    if (!this.selectorRect) return;

    const clientX = event.clientX;
    const clientY = event.clientY;

    const dx = clientX - this.centerX;
    const dy = clientY - this.centerY;

    let angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);

    angleDeg += 90;
    if (angleDeg < 0) {
      angleDeg += 360;
    }

    // const finalAngle = this.clamp(angleDeg, this.minAngle(), this.maxAngle());

    const finalAngle = Math.round(angleDeg);

    if (finalAngle !== this.currentAngle()) {
      this.currentAngle.set(finalAngle);
      this.change.emit(Math.round(this.currentAngle()));
      this.onChange(Math.round(this.currentAngle()));
    }
  }

  private setupPointerEvents(): void {
    const container = this.selectorContainer.nativeElement;

    const pointerDown$ = fromEvent<PointerEvent>(container, 'pointerdown').pipe(
      tap((event) => {
        event.preventDefault();
        this.isDragging.set(true);
        this.onTouched();
        this.updateSelectorDimensions();
      }),

      switchMap((event) => {
        this.calculateAngle(event);
        return merge(
          fromEvent<PointerEvent>(document, 'pointermove').pipe(
            tap((moveEvent) => moveEvent.preventDefault()),
            map((moveEvent) => this.calculateAngle(moveEvent)),

            filter(() => this.isDragging()),
            takeUntil(fromEvent(document, 'pointerup')),
          ),
          fromEvent<PointerEvent>(document, 'pointerup').pipe(
            tap((upEvent) => {
              upEvent.preventDefault();
              this.isDragging.set(false);
            }),
            takeUntil(fromEvent(document, 'pointercancel')),
          ),
        );
      }),
      repeat(),
    );

    pointerDown$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
