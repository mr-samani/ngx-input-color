import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OutputType } from '../../../ngx-input-color/src/lib/ngx-input-color/utils/color-helper';
import { ColorInspector } from '../../../ngx-input-color/src/lib/ngx-input-color/contracts/ColorInspector.enum';

import { NgxInputColorDirective } from '@ngx-input-color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgxInputColorDirective],
})
export class AppComponent {
  public readonly $topColor: WritableSignal<string> = signal<string>('#fff');

  color = 'pink';

  theme: 'light' | 'dark' | 'auto' = 'auto';
  outputType: OutputType = 'HEX';
  simpleMode = false;
  inspector: ColorInspector = ColorInspector.Picker;

  //gradient = ' radial-gradient(circle, rgb(230, 218, 218) 0%, rgb(39, 64, 70) 100%)'; // 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  gradient = 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  boxShadow = '50px 150px 10px 0px red';

  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
}
