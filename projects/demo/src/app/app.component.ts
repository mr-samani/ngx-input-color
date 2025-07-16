import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxInputColorModule, NgxInputGradientModule } from '../../../ngx-input-color/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxInputColorModule, NgxInputGradientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
  color = 'pink';
  gradient = 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
}
