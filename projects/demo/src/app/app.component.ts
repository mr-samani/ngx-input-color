import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgxBoxShadowComponent,
  NgxInputColorModule,
  NgxInputGradientModule,
} from '../../../ngx-input-color/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxInputColorModule, NgxInputGradientModule, FormsModule, NgxBoxShadowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
  color = 'pink';
  gradient = 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  boxShadow = '50px 150px 10px 0px red';
}
