import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { NgxInputColorComponent } from '../public-api';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { NgxColor } from '../utils/color-helper';
import { ColorInspector } from '@ngx-input-color/models/ColorInspector.enum';

@Directive({
  selector: '[ngxInputColor]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputColorDirective), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputColorDirective,
    },
  ],
})
export class NgxInputColorDirective implements OnDestroy, ControlValueAccessor, Validator {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() setInputBackgroundColor = true;
  @Input('defaultInspector') colorInspector: ColorInspector = ColorInspector.Picker;

  color?: NgxColor;
  private colorPickerComponentRef?: ComponentRef<NgxInputColorComponent>;
  private backdrop?: HTMLDivElement;
  private colorPickerEl?: HTMLElement;
  isDisabled = false;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
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
    if (this.color && this.color.isValid == false) {
      return { inValid: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.destroyColorPicker();
  }

  writeValue(value: any): void {
    if (value) {
      this.color = new NgxColor(value);
      if (this.setInputBackgroundColor) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.color.toHex8String());
      }
      this._onValidateChange();
    } else this.color = undefined;
  }

  toggleColorPicker() {
    if (this.colorPickerComponentRef) {
      this.destroyColorPicker();
      return;
    }

    // ایجاد کامپوننت
    this.colorPickerComponentRef = this.viewContainerRef.createComponent(NgxInputColorComponent);

    const instance = this.colorPickerComponentRef.instance;
    instance.colorInspector = this.colorInspector;
    instance.showCloseButton = true;
    instance.closeTitle = this.closeTitle;
    instance.confirmTitle = this.confirmTitle;

    // مقدار اولیه رنگ
    if (this.color && typeof this.color === 'object' && 'isValid' in this.color && this.color.isValid) {
      instance.initColor(this.color);
    }

    // رویدادها
    const sub1 = instance.confirm.subscribe((c: any) => {
      this.confirmColor(c);
      this.destroyColorPicker(); // بستن بعد از تایید
    });

    const sub2 = instance.cancel.subscribe(() => {
      this.destroyColorPicker();
    });

    // بک‌دراپ
    this.backdrop = this.renderer.createElement('div');
    if (this.backdrop) {
      this.backdrop.className = 'ngx-color-picker-backdrop';
      this.backdrop.onclick = () => this.destroyColorPicker();
    }
    // گرفتن المنت کامپوننت واقعی
    this.colorPickerEl = (this.colorPickerComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.renderer.appendChild(this.backdrop, this.colorPickerEl);
    this.renderer.appendChild(document.body, this.backdrop);
    this.setPosition();
  }

  @HostListener('window:resize', ['$event'])
  setPosition() {
    setTimeout(() => {
      if (!this.colorPickerEl || !this.colorPickerComponentRef) return;
      const hostRect = this.el.nativeElement.getBoundingClientRect();
      const pickerEl = this.colorPickerEl;

      // اعمال موقتی برای گرفتن سایز دقیق
      this.renderer.setStyle(pickerEl, 'position', 'absolute');
      this.renderer.setStyle(pickerEl, 'visibility', 'hidden');
      this.renderer.setStyle(pickerEl, 'top', '0px');
      this.renderer.setStyle(pickerEl, 'left', '0px');
      this.renderer.setStyle(pickerEl, 'z-index', '9999');

      document.body.appendChild(pickerEl); // لازم برای محاسبه دقیق اندازه

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

      // اعمال نهایی
      this.renderer.setStyle(pickerEl, 'visibility', 'visible');
      this.renderer.setStyle(pickerEl, 'top', `${top}px`);
      this.renderer.setStyle(pickerEl, 'left', `${left}px`);
    });
  }

  destroyColorPicker() {
    if (this.colorPickerComponentRef) {
      this.colorPickerComponentRef.destroy();
      this.colorPickerComponentRef = undefined;
    }
    if (this.backdrop && this.backdrop.parentNode) {
      this.renderer.removeChild(document.body, this.backdrop);
      this.backdrop = undefined;
    }
    this.colorPickerEl = undefined;
  }

  confirmColor(c: string) {
    this.color = new NgxColor(c);
    if (this.setInputBackgroundColor) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', c);
    }
    this._onChange(c);
    this.destroyColorPicker();
  }
}
