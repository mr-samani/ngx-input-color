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
import { NgxColor, OutputType } from '../../utils/color-helper';
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
  /** Title for the close button */
  @Input() closeTitle = 'Close';
  /** Title for the confirm button */
  @Input() confirmTitle = 'Ok';
  /** Whether to show the close button */
  @Input() showCloseButton = true;
  /** Whether to show the confirm button */
  @Input() showConfirmButton = true;
  /** Minifi UI  */
  @Input() simpleMode = false;

  @Input() outputType: OutputType = 'HEX';

  /**
   * default inspectors
   * - ColorInspector.Picker
   * - ColorInspector.RGB
   * - ColorInspector.HSL
   *
   * @alias defaultInspector
   */
  @Input() defaultInspector: ColorInspector = ColorInspector.Picker;

  /** Emitted when the color value changes */
  @Output() change = new EventEmitter<string>();
  /** Emitted when the confirm button is clicked */
  @Output() confirm = new EventEmitter<string>();
  /** Emitted when the cancel button is clicked */
  @Output() cancel = new EventEmitter<void>();

  /** @ignore */
  format: ColorFormats = ColorFormats.HSVA;
  /** @ignore */
  isDarkColor = true;

  /** @ignore */
  rgbaColor = 'rgba(0, 0, 0, 1)';
  /** @ignore */
  hexColor = '#000000';
  /** @ignore */
  name = 'black';

  /** @ignore */
  isSupportedEyeDrop: boolean;

  /** @ignore */
  color: NgxColor = new NgxColor();

  /** @ignore */
  isDisabled = false;
  /**@ignore */
  private _onChange = (value: string) => {};
  /**@ignore */
  private _onTouched = () => {};
  /**@ignore */
  private _onValidateChange = () => {};
  constructor(private cd: ChangeDetectorRef) {
    this.isSupportedEyeDrop = 'EyeDropper' in window;
  }

  /** @ignore */
  ngOnInit(): void {}
  /** @ignore */
  ngOnDestroy(): void {}
  public get ColorFormats(): typeof ColorFormats {
    return ColorFormats;
  }
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
  /** @ignore */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  /** @ignore */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  /** @ignore */
  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
  /** @ignore */
  registerOnValidatorChange(fn: () => void): void {
    this._onValidateChange = fn;
  }
  /** @ignore */
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.color && this.color.isValid === false) {
      return { invalid: true };
    }
    return null;
  }

  /** @ignore */
  writeValue(value: any): void {
    try {
      const c = value ? new NgxColor(value) : new NgxColor('#000');
      this.initColor(c);
      this._onValidateChange();
    } catch (e) {
      const c = new NgxColor('#000'); // مقدار پیش‌فرض
      this.initColor(c);
    }
  }
  /** @ignore */
  openEyeDrop() {
    if (this.isSupportedEyeDrop) {
      let t = new EyeDropper().open();
      t.then(async (result: { sRGBHex: string }) => {
        debugger
        this.hexColor = result.sRGBHex;
        this.initColor(new NgxColor(this.hexColor));
        this.cd.detectChanges();
      });
    }
  }

  /**
   *  call from directive
  /* @ignore 
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

  /** @ignore */
  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  /** @ignore */
  close() {
    this.cancel.emit();
  }

  /** @ignore */
  async ok() {
    this.emitChange();
    const output = await this.color.getOutputResult(this.outputType);
    this.confirm.emit(output);
  }
  /** @ignore */
  async emitChange() {
    const output = await this.color.getOutputResult(this.outputType);
    this._onChange(output);
    this.change.emit(output);
  }
}
