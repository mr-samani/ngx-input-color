import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderComponent } from "../../../ngx-input-color/src/slider/slider.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
