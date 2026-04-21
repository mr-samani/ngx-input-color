import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorInspector, NgxInputColor, OutputType } from 'ngx-input-color/color-picker';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  imports: [FormsModule, NgxInputColor],
})
export class ColorPickerComponent implements OnInit {
  color = 'pink';

  theme: 'light' | 'dark' | 'auto' = 'auto';
  outputType: OutputType = 'HEX';
  simpleMode = false;
  inspector: ColorInspector = ColorInspector.Picker;

  constructor() {}

  ngOnInit() {}
  public get ColorInspector(): typeof ColorInspector {
    return ColorInspector;
  }
}
