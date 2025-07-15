import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxColor } from '../../../utils/color-helper';
import { IPosition } from '../../../models/IPosition';
import { HSVA } from '../../../utils/interfaces';

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
  private inputColor?: NgxColor;
  @Input() simpleMode = false;

  @Input() set color(c: NgxColor) {
    if (c.equals(this.inputColor)) return;
    this.inputColor = c;
    const shva = c.toHsv();
    this.hue = shva.h;
    this.board = { x: shva.s, y: 100 - shva.v };
    this.alpha = shva.a ?? 1;
    this.baseColor = c.toHexString(false);
  }
  @Output() colorChange = new EventEmitter<NgxColor | undefined>();

  constructor() {}

  ngOnInit() {}

  generateColor() {
    try {
      const hsva: HSVA = { h: this.hue, s: this.board.x, v: 100 - this.board.y, a: this.alpha };
      const color = new NgxColor(hsva);
      this.baseColor = color.toHexString(false);
      if (color.equals(this.inputColor) == false) {
        this.inputColor = color;
        this.colorChange.emit(color);
      }
    } catch (error) {
      this.colorChange.emit(undefined);
    }
  }
}
