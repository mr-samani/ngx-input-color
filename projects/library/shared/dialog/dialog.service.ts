import { Injectable, Inject, ComponentRef, ApplicationRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogOptions } from './dialog-options';
import { DialogOverlayRef } from './dialog-overlay-ref';

interface DialogInstance {
  id: number;
  anchor: HTMLElement;
  element: HTMLDialogElement;
  componentRef: ComponentRef<any>;
  options: DialogOptions<any>;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private openDialogs = new Map<number, DialogInstance>();
  private idCounter = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private appRef: ApplicationRef,
  ) {}

  open<T>(options: DialogOptions<T>): DialogOverlayRef<T> {
    const {
      anchor,
      component,
      viewContainerRef,
      configure,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      onClosed,
    } = options;
    if (!viewContainerRef) {
      throw new Error('ViewContainerRef is required to render dialog content.');
    }

    const id = ++this.idCounter;

    const dialogElement = this.document.createElement('dialog');
    dialogElement.style.position = 'absolute';
    dialogElement.style.padding = '0';
    dialogElement.style.margin = '0';
    dialogElement.style.border = 'none';
    dialogElement.style.background = 'transparent';
    dialogElement.style.maxWidth = '100vw';
    dialogElement.style.maxHeight = '100vh';
    this.document.body.appendChild(dialogElement);
    const componentRef = viewContainerRef.createComponent(component);

    if (componentRef.location.nativeElement) {
      dialogElement.appendChild(componentRef.location.nativeElement);
    }

    if (closeOnEscape) {
      this.document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    if (window) window.addEventListener('resize', this.reposition.bind(this));

    const instance: DialogInstance = {
      id,
      anchor,
      element: dialogElement,
      componentRef: componentRef as ComponentRef<T>,
      options,
    };

    this.openDialogs.set(id, instance);
    dialogElement.showModal();
    if (closeOnBackdropClick) {
      this.document.addEventListener('click', this.handleClickOnBackdrop.bind(this));
    }
    const cleanUp = () => {
      this.close(id);
    };
    
    if (configure) {
      configure(componentRef.instance, new DialogOverlayRef(componentRef, dialogElement, cleanUp));
    }

    requestAnimationFrame(() => {
      this.positionDialog(instance);
    });

    // فوکوس روی اولین المان فوکوس‌پذیر
    setTimeout(() => {
      const focusable = dialogElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) {
        (focusable as HTMLElement).focus();
      }
    }, 0);

    const ref = new DialogOverlayRef(componentRef, dialogElement, cleanUp);
    return ref;
  }

  private positionDialog(dialogInstance: DialogInstance) {
    const anchor = dialogInstance.anchor;
    const dialog = dialogInstance.element;
    const { placement, alignment } = dialogInstance.options;
    if (!anchor || !dialog) return;
    const margin = dialogInstance.options.margin ?? 0;
    const anchorRect = anchor.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isRTL = getComputedStyle(this.document.documentElement).direction === 'rtl';

    let top = 0;
    let left = 0;

    const spaceBelow = vh - anchorRect.bottom;
    const spaceAbove = anchorRect.top;

    if (placement === 'bottom' || (placement === 'auto' && spaceBelow >= dialogRect.height + margin)) {
      top = anchorRect.bottom + margin;
      if (top + dialogRect.height > vh) {
        top = vh - dialogRect.height - margin;
      }
    } else {
      top = anchorRect.top - dialogRect.height - margin;
      if (top < margin) {
        top = margin;
      }
    }

    if (alignment === 'center') {
      left = anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2;
    } else if (alignment === 'start') {
      if (!isRTL) {
        left = anchorRect.left;
      } else {
        left = anchorRect.right - dialogRect.width;
      }
    } else {
      // end
      if (!isRTL) {
        left = anchorRect.right - dialogRect.width;
      } else {
        left = anchorRect.left;
      }
    }

    if (left < margin) left = margin;
    if (left + dialogRect.width > vw - margin) {
      left = vw - dialogRect.width - margin;
    }

    dialog.style.top = `${top}px`;
    dialog.style.left = `${left}px`;
    dialog.style.transform = 'none';
  }

  private getLastDialog(): DialogInstance | undefined {
    if (this.openDialogs.size === 0) return undefined;
    const lastKey = Array.from(this.openDialogs.keys()).pop();
    return lastKey ? this.openDialogs.get(lastKey) : undefined;
  }

  close(id: number) {
    const finded = this.openDialogs.get(id);
    if (!finded) return;
    const { closeOnEscape } = finded.options;

    finded.componentRef.destroy();
    if (finded.element.parentNode) {
      finded.element.remove();
    }
    finded.options?.onClosed?.();
    this.openDialogs.delete(id);

    if (this.openDialogs.size == 0) {
      this.document.removeEventListener('keydown', this.onKeyDown.bind(this));
      if (window) window.removeEventListener('resize', this.reposition.bind(this));
    }
  }

  closeAll(): void {
    const ids = Array.from(this.openDialogs.keys());
    ids.forEach((id) => {
      this.close(id);
    });
  }

  handleClickOnBackdrop(event: PointerEvent) {
    const target = event.target;
    
    const lastDialog = this.getLastDialog();
    if (!lastDialog) return;

    // The click target _must_ be the dialog element itself, and not elements underneath or inside.
    if (target !== lastDialog.element || !lastDialog.element?.open) return;
    // If the dialog contains a form, do not close the dialog when clicking outside of the dialog
    if (lastDialog.element.querySelector('form')) return;
    const rect = lastDialog.element.getBoundingClientRect();
    const clickWasInsideDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!clickWasInsideDialog) {
      this.close(lastDialog.id);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    const lastDialog = this.getLastDialog();
    if (!lastDialog) return;
    if (e.key === 'Escape') {
      this.close(lastDialog.id);
    }
  }

  reposition = () => {
    Array.from(this.openDialogs.keys()).forEach((id) => {
      let dialog = this.openDialogs.get(id);
      if (dialog && dialog.anchor && dialog.element.isConnected) {
        this.positionDialog(dialog);
      }
    });
  };
}
