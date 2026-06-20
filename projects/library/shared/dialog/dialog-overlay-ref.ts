import { ComponentRef } from '@angular/core';

export class DialogOverlayRef<T> {
  constructor(
    public readonly componentRef: ComponentRef<T>,
    private readonly dialogEl: HTMLDialogElement,
    private readonly teardownFn: () => void,
  ) {}

  close(): void {
    this.teardownFn();
  }

  get nativeElement(): HTMLElement {
    return this.dialogEl;
  }
}
