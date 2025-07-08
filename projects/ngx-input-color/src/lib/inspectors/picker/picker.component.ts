import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPosition } from '@ngx-input-color/models/IPosition';
import { TinyColor } from '@ngx-input-color/utils/color-converter';
import { HSVA } from '@ngx-input-color/utils/interfaces';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent implements OnInit {
  hue = 300;
  baseColor = 'rgb(0,0,0)';
  board: IPosition = { x: 1, y: 0 };
  alpha = 1;
  private inputColor?: TinyColor;

  @Input() set color(c: TinyColor) {
    this.inputColor = c;
    if (!c) return;
    const shva = c.toHsv();
    this.hue = shva.h;
    this.board = { x: shva.s, y: 1 - shva.v };
    this.alpha = shva.a;
    this.baseColor = c.toHex8String();
  }
  @Output() colorChange = new EventEmitter<TinyColor | undefined>();

  constructor() {}

  ngOnInit() {}

  generateColor() {
    try {
      const hsva: HSVA = { h: this.hue, s: this.board.x, v: 1 - this.board.y, a: this.alpha };
      const color = new TinyColor(hsva);
      this.baseColor = color.toHex8String();
      if (color.equals(this.inputColor) == false) {
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }
}
