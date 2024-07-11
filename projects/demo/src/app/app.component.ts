import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderComponent } from '../../../ngx-input-color/src/slider/slider.component';
import { SaturationComponent } from '../../../ngx-input-color/src/saturation/saturation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SliderComponent, SaturationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
}
