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
import { TinyColor } from '../utils/color-converter';

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

  color?: TinyColor;
  private colorPickerComponentRef?: ComponentRef<NgxInputColorComponent>;
  private backdrop?: HTMLDivElement;
  isDisabled = false;
  _onChange = (value: any) => {};
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
      this.color = new TinyColor(value);
      if (this.setInputBackgroundColor) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.color.toString());
      }
      this._onValidateChange();
    } else this.color = undefined;
  }

  toggleColorPicker() {
    if (this.colorPickerComponentRef) {
      this.destroyColorPicker();
    } else {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NgxInputColorComponent);
      this.colorPickerComponentRef = this.viewContainerRef.createComponent<NgxInputColorComponent>(componentFactory);
      this.colorPickerComponentRef.instance.showCloseButton = true;
      this.colorPickerComponentRef.instance.closeTitle = this.closeTitle;
      this.colorPickerComponentRef.instance.confirmTitle = this.confirmTitle;
      if (this.color && this.color.isValid) {
        this.colorPickerComponentRef.instance.initalColor(this.color);
      }
      this.colorPickerComponentRef.instance.confirm.subscribe((c) => this.confirmColor(c));
      this.colorPickerComponentRef.instance.cancel.subscribe(() => this.destroyColorPicker());

      this.backdrop = this.renderer.createElement('div') as HTMLDivElement;
      this.backdrop.className = 'ngx-color-picker-backdrop';
      this.backdrop.onclick = () => this.destroyColorPicker();

      const colorPicker = (this.colorPickerComponentRef.hostView as any).rootNodes[0] as HTMLElement;
      this.renderer.appendChild(this.backdrop, colorPicker);
      this.renderer.appendChild(document.body, this.backdrop);

      const rect = this.el.nativeElement.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      let top = rect.bottom;
      let left = rect.left;
      this.renderer.setStyle(colorPicker, 'position', 'absolute');
      if (top + colorPicker.offsetHeight > window.innerHeight) {
        top = rect.top - colorPicker.offsetHeight;
      }

      if (left + colorPicker.offsetWidth > window.innerWidth) {
        left = rect.right - colorPicker.offsetWidth;
      }

      if (top < bodyRect.top) {
        top = rect.bottom;
      }

      if (left < bodyRect.left) {
        left = rect.right;
      }

      this.renderer.setStyle(colorPicker, 'top', `${top}px`);
      this.renderer.setStyle(colorPicker, 'left', `${left}px`);
    }
  }

  destroyColorPicker() {
    if (this.colorPickerComponentRef) {
      this.colorPickerComponentRef.destroy();
      this.colorPickerComponentRef = undefined;
    }
    if (this.backdrop) {
      this.backdrop.remove();
    }
  }

  confirmColor(c: string) {
    this.color = new TinyColor(c);
    if (this.setInputBackgroundColor) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', c);
    }
    this._onChange(c);
    this.destroyColorPicker();
  }
}
