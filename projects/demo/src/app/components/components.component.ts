import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPosition, NgxInputColorModule, NgxInputGradientComponent } from '@ngx-input-color/public-api';
import { SaturationComponent } from '@ngx-input-color/saturation/saturation.component';
import { SliderComponent } from '@ngx-input-color/slider/slider.component';
import { RangeSliderComponent } from '@ngx-input-color/range-slider/range-slider.component';
import { buildGradientFromStops, generateRandomColor } from '@ngx-input-color/utils/build-gradient';
import { GradientStop } from '@ngx-input-color/models/GradientStop';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxInputColorModule, NgxInputGradientComponent],
})
export class ComponentsComponent implements OnInit {
  s: IPosition = {
    x: 50,
    y: 50,
  };

  slider = 50;

  resultGradient = '';

  constructor() {}

  ngOnInit() {}
}
