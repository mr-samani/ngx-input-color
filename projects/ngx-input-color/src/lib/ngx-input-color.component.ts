import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ColorFormats } from '../models/ColorFormats.enum';
import { NgxColor } from '../utils/color-helper';
import { ColorInspector } from '@ngx-input-color/models/ColorInspector.enum';
declare const EyeDropper: any;
@Component({
  selector: 'ngx-input-color',
  templateUrl: './ngx-input-color.component.html',
  styleUrls: ['./ngx-input-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxInputColorComponent implements OnInit {
  @Input() closeTitle = 'Close';
  @Input() confirmTitle = 'Ok';
  @Input() showCloseButton = false;
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
  constructor(private cd: ChangeDetectorRef) {
    this.isSupportedEyeDrop = 'EyeDropper' in window;
  }

  ngOnInit(): void {}
  public get ColorFormats(): typeof ColorFormats {
    return ColorFormats;
  }
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
  openEyeDrop() {
    if (this.isSupportedEyeDrop) {
      let t = new EyeDropper().open();
      t.then(async (result: { sRGBHex: string }) => {
        this.hexColor = result.sRGBHex;
        this.color = new NgxColor(this.hexColor);
        this.name = await this.color.name();
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
    // console.log('emit color', this.hexColor);
    this.change.emit(this.hexColor);
  }

  stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  close() {
    this.cancel.emit();
  }

  ok() {
    this.confirm.emit(this.hexColor);
  }
}
