import { Type, ViewContainerRef } from "@angular/core";
import { DialogOverlayRef } from "./dialog-overlay-ref";

export interface DialogOptions<T> {
  anchor: HTMLElement;
  component: Type<T>;
  viewContainerRef: ViewContainerRef;

  configure?: (instance: T, ref: DialogOverlayRef<T>) => void;

  margin?: number; // default: 8

  placement?: 'auto' | 'top' | 'bottom'; // default: auto
  alignment?: 'start' | 'center' | 'end'; // default: center

  closeOnBackdropClick?: boolean; // default: true

  onClosed?: () => void;
}