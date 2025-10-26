import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ColorInspector } from '../models/ColorInspector.enum';
import { NgxInputGradientComponent } from '../lib/ngx-input-gradient/ngx-input-gradient.component';
import { DOCUMENT } from '@angular/common';
import { isValidGradient, parseGradient } from '../utils/build-gradient';

@Directive({
  selector: '[ngxInputGradient]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputGradientDirective), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputGradientDirective,
    },
  ],
})
export class NgxInputGradientDirective implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() setInputBackground = true;
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  private _targetInput?: HTMLInputElement;
  @Input('ngxInputColor') set ngxInputColor(
    el: HTMLInputElement | ElementRef<HTMLInputElement> | null | undefined | ''
  ) {
    this.isHostInput = false;
    if (el instanceof ElementRef) {
      this._targetInput = el.nativeElement;
    } else if (el instanceof HTMLInputElement) {
      this.isHostInput = true;
      this._targetInput = el;
    } else {
      this._targetInput = undefined;
    }

    if (this._targetInput) {
      this._targetInput.addEventListener('input', this.boundInputHandler);
    }
  }
  @Output() change = new EventEmitter<string>();

  private boundInputHandler = (e: Event) => {
    this.writeValue((e.target as HTMLInputElement).value);
  };
  private isHostInput = false;
  private pickerComponentRef?: ComponentRef<NgxInputGradientComponent>;
  private backdrop?: HTMLDivElement;
  private pickerEl?: HTMLElement;
  isDisabled = false;

  value = '';

  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};
  constructor(
    @Inject(DOCUMENT) private _doc: Document,
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('click', ['$event']) onClick(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    this.toggleColorPicker();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this._targetInput && this._targetInput.tagName.toLowerCase() === 'input') {
        this.writeValue(this._targetInput.value);
      }
    });
  }
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

  ngOnDestroy(): void {
    this.destroyPicker();
  }

  writeValue(value: any): void {
    this.value = value;
    if (value && isValidGradient(value)) {
      const parsed = parseGradient(value);
      if (parsed.valid && this.setInputBackground) {
        this.renderer.setStyle(this.el.nativeElement, 'background', value);
      }
      // اگر دایرکتیو روی input باشه (ControlValueAccessor)
      if (this.isHostInput) {
        const input = this.el.nativeElement as HTMLInputElement;
        input.value = this.value;
      }
      this._onValidateChange();
    }
  }

  toggleColorPicker() {
    if (this.pickerComponentRef) {
      this.destroyPicker();
      return;
    }

    // ایجاد کامپوننت
    this.pickerComponentRef = this.viewContainerRef.createComponent(NgxInputGradientComponent);

    const instance = this.pickerComponentRef.instance;
    instance.setTheme = this.theme;
    instance.writeValue(this.value);
    instance.change.subscribe((c: string) => {
      this.value = c;
      this.emitChange(c);
    });
    // بک‌دراپ
    this.backdrop = this.renderer.createElement('div');
    if (this.backdrop) {
      this.backdrop.style.cssText = `
          background: #5e5e5e1e;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: auto;
          transition: all 300ms;
          z-index: 1000;
        `;
      this.backdrop.onclick = () => this.destroyPicker();
    }
    // گرفتن المنت کامپوننت واقعی
    this.pickerEl = (this.pickerComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.renderer.appendChild(this.backdrop, this.pickerEl);
    this.renderer.appendChild(this._doc.body, this.backdrop);
    this.setPosition();
  }

  @HostListener('window:resize', ['$event'])
  setPosition() {
    setTimeout(() => {
      if (!this.pickerEl || !this.pickerComponentRef) return;
      const hostRect = this.el.nativeElement.getBoundingClientRect();
      const pickerEl = this.pickerEl;

      // اعمال موقتی برای گرفتن سایز دقیق
      this.renderer.setStyle(pickerEl, 'position', 'absolute');
      this.renderer.setStyle(pickerEl, 'z-index', '1001');

      this._doc.body.appendChild(pickerEl); // لازم برای محاسبه دقیق اندازه

      const pickerRect = pickerEl.getBoundingClientRect();

      // وسط‌چین کردن افقی
      let left = hostRect.left + hostRect.width / 2 - pickerRect.width / 2;
      let top = hostRect.bottom;

      // جلوگیری از بیرون زدن از راست
      if (left + pickerRect.width > window.innerWidth) {
        left = window.innerWidth - pickerRect.width - 8;
      }

      // جلوگیری از بیرون زدن از چپ
      if (left < 8) {
        left = 8;
      }

      // اگر از پایین بیرون زد، ببر بالا
      if (top + pickerRect.height > window.innerHeight) {
        top = hostRect.top - pickerRect.height;
      }

      // جلوگیری از بیرون زدن از بالا
      if (top < 8) {
        top = 8;
      }

      this.renderer.setStyle(pickerEl, 'top', `${top}px`);
      this.renderer.setStyle(pickerEl, 'left', `${left}px`);
    });
  }

  destroyPicker() {
    if (this.pickerComponentRef) {
      this.pickerComponentRef.destroy();
      this.pickerComponentRef = undefined;
    }
    if (this.backdrop && this.backdrop.parentNode) {
      this.renderer.removeChild(this._doc.body, this.backdrop);
      this.backdrop = undefined;
    }
    this.pickerEl = undefined;
  }

  private async emitChange(c: string) {
    if (this.setInputBackground) {
      this.renderer.setStyle(this.el.nativeElement, 'background', c);
    }

    // اگر روی input باشیم، مقدار رو در input قرار بده
    if (this.isHostInput) {
      const input = this.el.nativeElement as HTMLInputElement;
      input.value = c;
    }

    // اگر targetInput وجود داره، در اونم مقدار ست کن
    if (this._targetInput instanceof HTMLInputElement) {
      this._targetInput.value = c;
      const event = new Event('input', { bubbles: true });
      this._targetInput.dispatchEvent(event);
    }

    this._onChange(c);
    this.change.emit(c);
    this._onTouched();
  }
}
