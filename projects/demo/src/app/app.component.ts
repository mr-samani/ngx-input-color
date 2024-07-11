import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderComponent } from '../../../ngx-input-color/src/slider/slider.component';
import { SaturationComponent } from '../../../ngx-input-color/src/saturation/saturation.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxInputColorComponent } from '../../../ngx-input-color/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SliderComponent,
    SaturationComponent,
    FormsModule,
    NgxInputColorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
  a = 63;
  b = 88;
}
