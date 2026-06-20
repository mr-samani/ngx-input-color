import { Type, ViewContainerRef } from "@angular/core";
import { DialogOverlayRef } from "./dialog-overlay-ref";

export interface DialogOptions<T> {
  anchor: HTMLElement;
  component: Type<T>;
  viewContainerRef: ViewContainerRef;

  configure?: (instance: T, ref: DialogOverlayRef<T>) => void;

  margin?: number; // default: 8
  zIndex?: number; // default: 1000
  backdropColor?: string; // default: rgba(0,0,0,.18)

  placement?: 'auto' | 'top' | 'bottom'; // default: auto
  alignment?: 'start' | 'center' | 'end'; // default: center

  closeOnBackdropClick?: boolean; // default: true
  closeOnEscape?: boolean; // default: true

  onClosed?: () => void;
}