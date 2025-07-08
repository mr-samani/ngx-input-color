import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxInputColorModule } from '@ngx-input-color/ngx-input-color.module';
 
@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  imports: [CommonModule, FormsModule, NgxInputColorModule],
  standalone: true,
})
export class DemoPageComponent implements OnInit {
  color = 'blueviolet';

  inlineColor = '';

  constructor() {}

  ngOnInit() {
    // debugger;
    // let c = new TinyColor(this.color);
    // const cmyk = c.toCmyk();
    // console.log(cmyk);

    // let c2 = new TinyColor(cmyk);
    // const cmyk2 = c2.toCmyk();
    // console.log(cmyk2);
  }
}
