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
  standalone: false,
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
  host: {
    '[class.dark]': 'theme=="dark"',
  },
})
export class NgxInputColorComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  theme: 'light' | 'dark' | 'auto' = 'auto';
  @Input('theme') set setTheme(val: 'light' | 'dark' | 'auto') {
    if (!val || val == 'auto') {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      this.theme = val;
    }
  }

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

  /** @ignore */
  format: ColorFormats = ColorFormats.HSVA;
  /** @ignore */
  isDarkColor = true;

  /** @ignore */
  rgbaColor = 'rgba(0, 0, 0, 1)';
  /** @ignore */
  hexColor = '#000000';
  outputColor = '';

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
  ngOnInit(): void {
    if (this.theme == 'auto') {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }
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
    this.outputColor = await this.color.getOutputResult(this.outputType);
    this.isDarkColor = this.color.isDark();
    this.name = await this.color.name();
    this.emitChange();
  }

  /** @ignore */
  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  /** @ignore */
  async emitChange() {
    this.outputColor = await this.color.getOutputResult(this.outputType);
    this._onChange(this.outputColor);
    this.change.emit(this.outputColor);
  }
}
