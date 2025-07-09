import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPosition } from '@ngx-input-color/public-api';
import { SaturationComponent } from '@ngx-input-color/saturation/saturation.component';
import { SliderComponent } from '@ngx-input-color/slider/slider.component';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  standalone: true,
  imports: [CommonModule, SaturationComponent, SliderComponent, FormsModule],
})
export class ComponentsComponent implements OnInit {
  s: IPosition = {
    x: 50,
    y: 50,
  };

  slider = 50;

  constructor() {}

  ngOnInit() {}
}
