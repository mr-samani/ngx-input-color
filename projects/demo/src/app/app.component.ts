import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgxInputBoxShadowModule,
  NgxInputColorModule,
  NgxInputGradientModule,
} from '../../../ngx-input-color/src/public-api';
import { OutputType } from '../../../ngx-input-color/src/utils/color-helper';
import { ColorInspector } from '../../../ngx-input-color/src/models/ColorInspector.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxInputColorModule, NgxInputGradientModule, FormsModule, NgxInputBoxShadowModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  color = 'pink';
  outputType: OutputType = 'HEX';
  simpleMode = false;
  inspector: ColorInspector = ColorInspector.Picker;

  gradient = 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  boxShadow = '50px 150px 10px 0px red';

  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
}
