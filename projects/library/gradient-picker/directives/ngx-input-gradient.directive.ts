import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
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
import { NgxInputGradientComponent } from '../components/input-gradient.component';
import { isValidGradient, parseGradient } from '../utils/build-gradient';
import { DialogOverlayRef, DialogService } from 'ngx-input-color/shared';

@Directive({
  selector: '[ngxInputGradient]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputGradient), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputGradient,
    },
  ],
})
export class NgxInputGradient implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() setInputBackground = true;
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
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
      this._targetInput.addEventListener('input', this.boundInputHandler);
    }
  }
  @Output() change = new EventEmitter<string>();

  private boundInputHandler = (e: Event) => {
    this.writeValue((e.target as HTMLInputElement).value);
  };
  private isHostInput = false;
  private pickerRef?: DialogOverlayRef<NgxInputGradientComponent>;
  isDisabled = false;

  value = '';

  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
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
      if (this.setInputBackground) {
        this.renderer.setStyle(this.el.nativeElement, 'background', value);
      }
      // اگر دایرکتیو روی input باشه (ControlValueAccessor)
      if (this.isHostInput) {
        const input = this.el.nativeElement as HTMLInputElement;
        input.value = this.value;
      }
      this._onValidateChange();
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background', '');
    }
  }

  toggleColorPicker() {
    if (this.pickerRef) {
      this.destroyPicker();
      return;
    }

    this.pickerRef = this.dialogService.open({
      anchor: this.el.nativeElement,
      component: NgxInputGradientComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'start',
      placement: 'auto',
      configure: (instance, ref) => {
        instance.setTheme = this.theme;
        instance.writeValue(this.value);

        instance.change.subscribe((c: string) => {
          this.value = c;
          this.emitChange(c);
        });

        // instance.closed.subscribe(() => ref.close());
      },
      onClosed: () => {
        this.pickerRef = undefined;
      },
    });
  }

  destroyPicker() {
    if (this.pickerRef) {
      this.pickerRef = undefined;
    }
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
