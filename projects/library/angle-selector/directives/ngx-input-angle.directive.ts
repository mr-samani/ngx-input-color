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
  input,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DialogOverlayRef, DialogService } from 'ngx-input-color/shared';
import { NgxAngleSelectorComponent } from '../components/input-angle.component';

@Directive({
  selector: '[ngxInputAngle]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxInputAngle),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxInputAngle),
      multi: true,
    },
  ],
})
export class NgxInputAngle implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  size = input<number>(90);
  @Input('value') set setValue(val: string) {
    this.writeValue(val);
  }

  private boundInputHandler = (e: Event) => {
    this.writeValue((e.target as HTMLInputElement).value);
  };
  private _targetInput?: HTMLInputElement;

  @Input('NgxInputAngle') set NgxInputAngle(
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
      this._targetInput.addEventListener('input', this.boundInputHandler.bind(this));
    }
  }
  @Output() change = new EventEmitter<number>();
  private value?: number;
  private pickerRef?: DialogOverlayRef<NgxAngleSelectorComponent>;
  private isHostInput = false;
  inValid: boolean = false;
  isDisabled = false;
  _onChange = (value: number) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
  ) {}

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

  writeValue(val: any): void {
    try {
      this.value = Number.parseInt(val);
      // اگر input خارجی مشخص شده
      if (this._targetInput instanceof HTMLInputElement) {
        this.renderer.setProperty(this._targetInput, 'value', this.value);
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'value', this.value);
      }

      this.inValid = false;
      this._onValidateChange();
    } catch (e) {
      this.value = 0; // مقدار پیش‌فرض
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
    if (this.inValid === true) {
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
      component: NgxAngleSelectorComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'end',
      placement: 'top',
      margin: 2,
      configure: (instance, ref) => {
        instance.size = this.size;
        instance.writeValue(this.value);

        instance.change.subscribe((c: number) => {
          this.value = c;
          console.log('v', c);
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
    this.pickerRef = undefined;
  }

  private async emitChange(c: number) {
    // اگر targetInput وجود داره، در اونم مقدار ست کن
    if (this._targetInput instanceof HTMLInputElement) {
      this.renderer.setProperty(this.el.nativeElement, 'value', c);
      const event = new Event('input', { bubbles: true });
      this._targetInput.dispatchEvent(event);
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', c);
    }

    this._onChange(c);
    this.change.emit(c);
    this._onTouched();
  }
}
