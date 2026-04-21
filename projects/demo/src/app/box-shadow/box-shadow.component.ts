import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxBoxShadowComponent, NgxInputBoxShadow } from 'ngx-input-color/box-shadow';

@Component({
  selector: 'app-box-shadow',
  templateUrl: './box-shadow.component.html',
  styleUrls: ['./box-shadow.component.scss'],
  imports: [FormsModule, NgxInputBoxShadow, NgxBoxShadowComponent],
})
export class BoxShadowComponent implements OnInit {
  boxShadow = '50px 150px 10px 0px red';

  constructor() {}

  ngOnInit() {}
}
