import {
  Directive,
  forwardRef,
  OnDestroy,
  Input,
  ComponentRef,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  HostListener,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ColorInspector } from '../models/ColorInspector.enum';
import { NgxInputColorComponent } from '../lib/ngx-input-color/ngx-input-color.component';
import { NgxColor } from '../utils/color-helper';

@Directive({
  selector: '[ngxInputColor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputColorDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputColorDirective),
      multi: true,
    },
  ],
})
export class NgxInputColorDirective implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() setInputBackgroundColor = true;
  @Input() defaultInspector: ColorInspector = ColorInspector.Picker;

  @Input() showCloseButton = true;
  @Input() showConfirmButton = true;
  @Input() simpleMode = false;
  private boundInputHandler = (e: Event) => {
    this.writeValue((e.target as HTMLInputElement).value);
  };
  private _targetInput?: HTMLInputElement;

  @Input('ngxInputColor') set ngxInputColor(
    el: HTMLInputElement | ElementRef<HTMLInputElement> | null | undefined | ''
  ) {
    if (el instanceof ElementRef) {
      this._targetInput = el.nativeElement;
    } else if (el instanceof HTMLInputElement) {
      this._targetInput = el;
    } else {
      this._targetInput = undefined;
    }

    if (this._targetInput) {
      this._targetInput.addEventListener('input', this.boundInputHandler);
    }
  }
  @Output() change = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  private color?: NgxColor;
  private colorPickerComponentRef?: ComponentRef<NgxInputColorComponent>;
  private backdrop?: HTMLDivElement;
  private colorPickerEl?: HTMLElement;
  private isHostInput = false;
  inValid: boolean = false;
  isDisabled = false;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2, private viewContainerRef: ViewContainerRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this._targetInput && this._targetInput.tagName.toLowerCase() === 'input') {
        this.writeValue(this._targetInput.value);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroyColorPicker();
  }

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    this.toggleColorPicker();
  }

  writeValue(value: any): void {
    try {
      this.color = value ? new NgxColor(value) : undefined;

      const colorStr = this.color?.toHexString() ?? '';

      // اگر دایرکتیو روی input باشه (ControlValueAccessor)
      if (this.isHostInput) {
        const input = this.el.nativeElement as HTMLInputElement;
        input.value = colorStr;
      }

      // اگر input خارجی مشخص شده
      if (this._targetInput instanceof HTMLInputElement) {
        this._targetInput.value = colorStr;
      }

      if (this.setInputBackgroundColor && colorStr) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', colorStr);
      }

      this.inValid = false;
      this._onValidateChange();
    } catch (e) {
      this.color = new NgxColor('#000'); // مقدار پیش‌فرض
      this.inValid = true;
    }
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
    if ((this.color && this.color.isValid === false) || this.inValid === true) {
      return { invalid: true };
    }
    return null;
  }

  private toggleColorPicker() {
    if (this.colorPickerComponentRef) {
      this.destroyColorPicker();
      return;
    }

    this.colorPickerComponentRef = this.viewContainerRef.createComponent(NgxInputColorComponent);
    const instance = this.colorPickerComponentRef.instance;

    instance.defaultInspector = this.defaultInspector;
    instance.showCloseButton = true;
    instance.closeTitle = this.closeTitle;
    instance.confirmTitle = this.confirmTitle;
    instance.showCloseButton = this.showCloseButton;
    instance.showConfirmButton = this.showConfirmButton;
    instance.simpleMode = this.simpleMode;

    if (this.color?.isValid) instance.initColor(this.color);
    instance.change.subscribe((c: string) => {
      this.change.emit(c);
    });
    instance.confirm.subscribe((c: string) => {
      this.confirm.emit(c);
      this.confirmColor(c);
      this.destroyColorPicker();
    });

    instance.cancel.subscribe(() => {
      this.cancel.emit();
      this.destroyColorPicker();
    });

    this.backdrop = this.renderer.createElement('div');
    if (this.backdrop) {
      this.backdrop.className = 'ngx-color-picker-backdrop';
      this.backdrop.onclick = () => this.destroyColorPicker();
    }
    this.colorPickerEl = (this.colorPickerComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.renderer.appendChild(this.backdrop, this.colorPickerEl);
    this.renderer.appendChild(document.body, this.backdrop);
    this.setPosition();
  }

  @HostListener('window:resize')
  setPosition() {
    setTimeout(() => {
      if (!this.colorPickerEl) return;

      const hostRect = this.el.nativeElement.getBoundingClientRect();
      const pickerEl = this.colorPickerEl;

      this.renderer.setStyle(pickerEl, 'position', 'absolute');
      this.renderer.setStyle(pickerEl, 'visibility', 'hidden');
      this.renderer.setStyle(pickerEl, 'top', '0px');
      this.renderer.setStyle(pickerEl, 'left', '0px');
      this.renderer.setStyle(pickerEl, 'z-index', '9999');

      document.body.appendChild(pickerEl);
      const pickerRect = pickerEl.getBoundingClientRect();

      let left = hostRect.left + hostRect.width / 2 - pickerRect.width / 2;
      let top = hostRect.bottom;

      if (left + pickerRect.width > window.innerWidth) left = window.innerWidth - pickerRect.width - 8;
      if (left < 8) left = 8;
      if (top + pickerRect.height > window.innerHeight) top = hostRect.top - pickerRect.height;
      if (top < 8) top = 8;

      this.renderer.setStyle(pickerEl, 'visibility', 'visible');
      this.renderer.setStyle(pickerEl, 'top', `${top}px`);
      this.renderer.setStyle(pickerEl, 'left', `${left}px`);
    });
  }

  private destroyColorPicker() {
    this.colorPickerComponentRef?.destroy();
    this.colorPickerComponentRef = undefined;

    if (this.backdrop) {
      this.renderer.removeChild(document.body, this.backdrop);
      this.backdrop = undefined;
    }

    this.colorPickerEl = undefined;
  }

  private confirmColor(c: string) {
    this.color = new NgxColor(c);

    if (this.setInputBackgroundColor) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', c);
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
    this._onTouched();
  }
}
