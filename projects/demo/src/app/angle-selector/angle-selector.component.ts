import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputAngle } from 'ngx-input-color/angle-selector';

@Component({
  selector: 'app-angle-selector',
  templateUrl: './angle-selector.component.html',
  styleUrls: ['./angle-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,NgxInputAngle ],
})
export class AngleSelectorComponent implements OnInit {
  angle = 135;
  constructor() {}

  ngOnInit() {}
}
