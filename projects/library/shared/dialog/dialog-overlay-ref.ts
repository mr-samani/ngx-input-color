import { ComponentRef } from '@angular/core';

export class DialogOverlayRef<T> {
  constructor(
    public readonly componentRef: ComponentRef<T>,
    private readonly backdropEl: HTMLDivElement,
    private readonly panelEl: HTMLDivElement,
    private readonly teardownFn: () => void,
  ) {}

  close(): void {
    this.teardownFn();
  }

  get nativeElement(): HTMLElement {
    return this.panelEl;
  }
}
