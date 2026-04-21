import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputGradient, NgxInputGradientComponent } from 'ngx-input-color/gradient-picker';

@Component({
  selector: 'app-gradient-picker',
  templateUrl: './gradient-picker.component.html',
  styleUrls: ['./gradient-picker.component.scss'],
  imports: [FormsModule, NgxInputGradient, NgxInputGradientComponent],
})
export class GradientPickerComponent implements OnInit {
  //gradient = ' radial-gradient(circle, rgb(230, 218, 218) 0%, rgb(39, 64, 70) 100%)'; // 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  gradient = 'linear-gradient(90deg, #2A9FD3 0%, #8B1ACF 100%)';
  constructor() {}

  ngOnInit() {}
}
