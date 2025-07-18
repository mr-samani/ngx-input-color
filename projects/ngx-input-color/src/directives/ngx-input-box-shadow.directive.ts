import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
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
import { DOCUMENT } from '@angular/common'; 
import { NgxBoxShadowComponent } from '../lib/ngx-box-shadow/ngx-box-shadow.component';

@Directive({
  selector: '[ngxInputBoxShadow]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputBoxShadowDirective), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputBoxShadowDirective,
    },
  ],
})
export class NgxInputBoxShadowDirective implements OnDestroy, ControlValueAccessor, Validator {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() setInputBackground = true;

  private pickerComponentRef?: ComponentRef<NgxBoxShadowComponent>;
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
   
  }

  toggleColorPicker() {
    if (this.pickerComponentRef) {
      this.destroyPicker();
      return;
    }

    // ایجاد کامپوننت
    this.pickerComponentRef = this.viewContainerRef.createComponent(NgxBoxShadowComponent);

    const instance = this.pickerComponentRef.instance;
    instance.showCloseButton = true;
    instance.closeTitle = this.closeTitle;
    instance.confirmTitle = this.confirmTitle;
    instance.writeValue(this.value);

    // رویدادها
    const sub1 = instance.confirm.subscribe((c: any) => {
      this.confirmColor(c);
    });

    const sub2 = instance.cancel.subscribe(() => {
      this.destroyPicker();
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
      this.renderer.setStyle(pickerEl, 'z-index', '9999');

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

  confirmColor(c: string) {
    if (this.setInputBackground) {
      this.renderer.setStyle(this.el.nativeElement, 'background', c);
    }
    this._onChange(c);
    this.value = c;
    this.destroyPicker();
  }
}
