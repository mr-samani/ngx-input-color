import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ColorFormats } from '../../models/ColorFormats.enum';
import { NgxColor } from '../../utils/color-helper';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ColorInspector } from '../../models/ColorInspector.enum';
declare const EyeDropper: any;
@Component({
  selector: 'ngx-input-color',
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxInputColorComponent), multi: true },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxInputColorComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxInputColorComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() showCloseButton = true;
  @Input() showConfirmButton = true;
  @Input() simpleMode = false;
  @Input('defaultInspector') colorInspector: ColorInspector = ColorInspector.Picker;

  @Output() change = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  format: ColorFormats = ColorFormats.HSVA;
  isDarkColor = false;

  rgbaColor = '';
  hexColor = '';
  name = '';

  isSupportedEyeDrop: boolean;

  color = new NgxColor();

  isDisabled = false;
  _onChange = (value: string) => {};
  _onTouched = () => {};
  _onValidateChange = () => {};
  constructor(private cd: ChangeDetectorRef) {
    this.isSupportedEyeDrop = 'EyeDropper' in window;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  public get ColorFormats(): typeof ColorFormats {
    return ColorFormats;
  }
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
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
    if (this.color && this.color.isValid === false) {
      return { invalid: true };
    }
    return null;
  }

  writeValue(value: any): void {
    try {
      this.color = value ? new NgxColor(value) : new NgxColor('#000');
      this._onValidateChange();
    } catch (e) {
      this.color = new NgxColor('#000'); // مقدار پیش‌فرض
    }
  }
  openEyeDrop() {
    if (this.isSupportedEyeDrop) {
      let t = new EyeDropper().open();
      t.then(async (result: { sRGBHex: string }) => {
        this.hexColor = result.sRGBHex;
        this.initColor(new NgxColor(this.hexColor));
        this.cd.detectChanges();
      });
    }
  }

  /**
   *  call from directive
   */
  async initColor(c?: NgxColor) {
    if (!c) return;
    this.color = c;
    this.rgbaColor = this.color.toRgbString();
    this.hexColor = this.color.toHexString();
    this.isDarkColor = this.color.isDark();
    this.name = await this.color.name();
    if (this.showConfirmButton == false) {
      this.emitChange();
    } else {
      this.change.emit(this.hexColor);
    }
  }

  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  close() {
    this.cancel.emit();
  }

  ok() {
    this.emitChange();
  }
  emitChange() {
    this._onChange(this.hexColor);
    this.change.emit(this.hexColor);
    this.confirm.emit(this.hexColor);
  }
}
