import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { NgxInputColorComponent } from '../public-api';

@Directive({
  selector: '[ngxInputColor]',
})
export class NgxInputColorDirective {
  private colorPickerComponentRef: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  @HostListener('click') onClick() {
    this.toggleColorPicker();
  }

  toggleColorPicker() {
    if (this.colorPickerComponentRef) {
      this.colorPickerComponentRef.destroy();
      this.colorPickerComponentRef = null;
    } else {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NgxInputColorComponent);
      this.colorPickerComponentRef = this.viewContainerRef.createComponent(componentFactory);

      const domElem = (this.colorPickerComponentRef.hostView as any).rootNodes[0] as HTMLElement;

      this.renderer.appendChild(document.body, domElem);

      const rect = this.el.nativeElement.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      let top = rect.bottom;
      let left = rect.left;

      if (top + domElem.offsetHeight > window.innerHeight) {
        top = rect.top - domElem.offsetHeight;
      }

      if (left + domElem.offsetWidth > window.innerWidth) {
        left = rect.right - domElem.offsetWidth;
      }

      if (top < bodyRect.top) {
        top = rect.bottom;
      }

      if (left < bodyRect.left) {
        left = rect.right;
      }

      this.renderer.setStyle(domElem, 'position', 'absolute');
      this.renderer.setStyle(domElem, 'top', `${top}px`);
      this.renderer.setStyle(domElem, 'left', `${left}px`);
    }
  }


}
