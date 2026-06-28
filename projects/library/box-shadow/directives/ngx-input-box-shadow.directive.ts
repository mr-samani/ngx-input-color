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
import { DOCUMENT } from '@angular/common';
import { NgxBoxShadowComponent } from '../components/box-shadow.component';
import { DialogOverlayRef, DialogService } from 'ngx-input-color/shared';

@Directive({
  selector: '[ngxInputBoxShadow]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputBoxShadow), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputBoxShadow,
    },
  ],
})
export class NgxInputBoxShadow implements OnDestroy, ControlValueAccessor, Validator {
  @Input() setInputBackground = true;

  private pickerRef?: DialogOverlayRef<NgxBoxShadowComponent>;

  value = '';

  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};
  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private dialogService: DialogService,
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
    return null;
  }

  ngOnDestroy(): void {
    this.destroyPicker();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  toggleColorPicker() {
    if (this.pickerRef) {
      this.destroyPicker();
      return;
    }
    this.pickerRef = this.dialogService.open({
      anchor: this.el.nativeElement,
      component: NgxBoxShadowComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'start',
      placement: 'auto',
      configure: (instance, ref) => {
        instance.writeValue(this.value);

        instance.change.subscribe((c: string) => {
          this._onChange(c);
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
      this.pickerRef.close();
      this.pickerRef = undefined;
    }
  }
}
