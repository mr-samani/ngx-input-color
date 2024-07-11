import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { getOffsetPosition } from '../helper/get-offset-position';

@Component({
  selector: 'saturation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saturation.component.html',
  styleUrl: './saturation.component.scss',
})
export class SaturationComponent {
  @Input() color = 'red';

  isDragging = false;
  @ViewChild('saturation', { static: true })
  saturation!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef<HTMLDivElement>;
  x = 0;
  y = 0;

  dragStart(ev: MouseEvent | TouchEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isDragging = true;
    this.updatePosition(ev);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDrag(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updatePosition(ev);
  }

  private updatePosition(ev: MouseEvent | TouchEvent) {
    let position = getOffsetPosition(ev, this.saturation.nativeElement);
    let thumbRec = this.thumb.nativeElement.getBoundingClientRect();
    let saturationRec = this.saturation.nativeElement.getBoundingClientRect();
    if (position.x < 0) {
      this.x = 0;
    } else if (position.x > saturationRec.width) {
      this.x = saturationRec.width;
    } else {
      this.x = position.x;
    }
   // this.x = this.x - thumbRec.width / 2;

    if (position.y < 0) {
      this.y = 0;
    } else if (position.y > saturationRec.height) {
      this.y = saturationRec.height;
    } else {
      this.y = position.y;
    }
  //  this.y = this.y - thumbRec.height / 2;
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }
}
