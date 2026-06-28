import {
  Directive,
  forwardRef,
  OnDestroy,
  Input,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  HostListener,
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
  exportAs: 'ngxInputAngle',
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
export class NgxInputAngle implements OnDestroy, ControlValueAccessor, Validator {
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  size = input<number>(90);
  openOnCLick = input<boolean>(true);
  @Output() change = new EventEmitter<number>();
  private value?: number | null;
  private pickerRef?: DialogOverlayRef<NgxAngleSelectorComponent>;
  inValid: boolean = false;
  _onChange = (value?: number | null) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
  ) {}

  ngOnDestroy(): void {
    this.destroyAnglePicker();
  }

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.openOnCLick()) {
      ev.stopPropagation();
      ev.preventDefault();
      this.toggle();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.parseInput(input.value);
    this._onChange(this.value);
  }

  @HostListener('blur')
  onBlur() {
    this._onTouched();
  }

  writeValue(val: any): void {
    this.parseInput(val);
    this.renderer.setProperty(this.el.nativeElement, 'value', this.value);

    this.inValid = false;
    if (this.pickerRef) {
      this.pickerRef.componentRef.instance.writeValue(this.value);
    }
    this._onValidateChange();
  }

  parseInput(val: any) {
    try {
      this.inValid = false;
      this.value = val != null && val != undefined ? Number.parseInt(val) : val;
    } catch {
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
    if (this.inValid === true) {
      return { invalid: true };
    }
    if (this.value && this.value > 360) return { max: true };
    if (this.value && this.value < 0) return { min: true };
    return null;
  }

  public toggle() {
    if (this.pickerRef) {
      this.destroyAnglePicker();
      return;
    }

    this.pickerRef = this.dialogService.open({
      anchor: this.el.nativeElement,
      component: NgxAngleSelectorComponent,
      viewContainerRef: this.viewContainerRef,
      alignment: 'center',
      placement: 'bottom',
      margin: 2,
      configure: (instance, ref) => {
        instance.size = this.size;
        instance.setTheme = this.theme;
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

  private destroyAnglePicker() {
    this.pickerRef?.close();
    this.pickerRef = undefined;
  }

  private async emitChange(c: number) {
    this.renderer.setProperty(this.el.nativeElement, 'value', c);

    this._onChange(c);
    this.change.emit(c);
    this._onTouched();
  }
}
