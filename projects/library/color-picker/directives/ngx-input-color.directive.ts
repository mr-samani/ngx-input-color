import {
  Directive,
  forwardRef,
  OnDestroy,
  Input,
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
import { ColorInspector } from '../contracts/ColorInspector.enum';
import { NgxInputColorComponent } from '../components/input-color.component';
import { NgxColor } from '../utils/color-helper';
import { OutputType } from '../contracts/OutputType';
import { DialogOverlayRef, DialogService } from 'ngx-input-color/shared';

@Directive({
  selector: '[ngxInputColor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputColor),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputColor),
      multi: true,
    },
  ],
})
export class NgxInputColor implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() setInputBackgroundColor = true;
  @Input() defaultInspector: ColorInspector = ColorInspector.Picker;
  @Input() simpleMode = false;
  @Input() outputType: OutputType = 'HEX';
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  private useAlphaChannel: boolean = true;
  @Input('useAlphaChannel') set setUseAlphaChannel(val: boolean) {
    this.useAlphaChannel = val == true;
    if (!this.useAlphaChannel && this.color) {
      this.color.removeAlphaChannel();
      this.color.getOutputResult(this.outputType).then((c) => {
        this.emitChange(c);
      });
    }
  }

  private boundInputHandler = (e: Event) => {
    this.writeValue((e.target as HTMLInputElement).value);
  };
  private _targetInput?: HTMLInputElement;

  @Input('ngxInputColor') set ngxInputColor(
    el: HTMLInputElement | ElementRef<HTMLInputElement> | null | undefined | '',
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
      this._targetInput.removeEventListener('input', this.boundInputHandler);
      this._targetInput.addEventListener('input', this.boundInputHandler);
    }
  }
  @Output() change = new EventEmitter<string>();
  private color?: NgxColor;
  private pickerRef?: DialogOverlayRef<NgxInputColorComponent>;
  private isHostInput = false;
  inValid: boolean = false;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
  ) {}

  ngAfterViewInit(): void {
    if (this._targetInput && this._targetInput.tagName.toLowerCase() === 'input') {
      this.writeValue(this._targetInput.value);
    }
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

      if (this.setInputBackgroundColor) {
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
    if (disabled) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', disabled);
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
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
    if (this.pickerRef) {
      this.destroyColorPicker();
      return;
    }

    this.pickerRef = this.dialogService.open({
      anchor: this.el.nativeElement,
      component: NgxInputColorComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'start',
      placement: 'auto',
      configure: (instance, ref) => {
        instance.defaultInspector = this.defaultInspector;
        instance.simpleMode = this.simpleMode;
        instance.outputType = this.outputType;
        instance.setTheme = this.theme;
        instance.setUseAlphaChannel = this.useAlphaChannel;
        if (this.color?.isValid) instance.writeValue(this.color);

        instance.change.subscribe((c: string) => {
          this.color = new NgxColor(c);
          this.emitChange(c);
        });

        // instance.closed.subscribe(() => ref.close());
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  private destroyColorPicker() {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }

  private async emitChange(c: string) {
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
    this.change.emit(c);
    this._onTouched();
  }
}
