import { Injectable, Inject, ComponentRef, ApplicationRef, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogOptions } from './dialog-options';
import { DialogOverlayRef } from './dialog-overlay-ref';

interface DialogInstance {
  id: number;
  anchor: HTMLElement;
  element: HTMLDialogElement;
  componentRef: ComponentRef<any>;
  options: DialogOptions<any>;
  cleanup: () => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService implements OnDestroy {
  private openDialogs = new Map<number, DialogInstance>();
  private idCounter = 0;

  private globalKeyDownAdded = false;
  private globalResizeAdded = false;
  private globalClickAdded = false;

  private globalKeyDownListener: (e: KeyboardEvent) => void;
  private globalResizeListener: () => void;
  private globalClickListener: (e: PointerEvent) => void;

  private doc = inject(DOCUMENT);
  constructor() {
    this.globalKeyDownListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const lastDialog = this.getLastDialog();
        if (lastDialog) {
          lastDialog.cleanup();
        }
      }
    };

    this.globalResizeListener = () => {
      this.repositionAll();
    };

    this.globalClickListener = (e: PointerEvent) => {
      this.handleClickOnBackdrop(e);
    };
  }

  ngOnDestroy(): void {
    this.closeAll();
  }

  handleGlobalListeners() {
    // مطمئن شویم لیسنرها فقط یک بار اضافه شده‌اند
    if (!this.globalKeyDownAdded) {
      this.doc.addEventListener('keydown', this.globalKeyDownListener);
      this.globalKeyDownAdded = true;
    }
    if (!this.globalResizeAdded) {
      window.addEventListener('resize', this.globalResizeListener);
      this.globalResizeAdded = true;
    }
    if (!this.globalClickAdded) {
      this.doc.addEventListener('click', this.globalClickListener);
      this.globalClickAdded = true;
    }
  }

  open<T>(options: DialogOptions<T>): DialogOverlayRef<T> {
    const { anchor, component, viewContainerRef, configure, onClosed } = options;

    if (!viewContainerRef) {
      throw new Error('ViewContainerRef is required to render dialog content.');
    }

    this.handleGlobalListeners();

    const id = ++this.idCounter;

    const dialogElement = this.doc.createElement('dialog');

    dialogElement.style.position = 'absolute';
    dialogElement.style.padding = '0';
    dialogElement.style.margin = '0';
    dialogElement.style.border = 'none';
    dialogElement.style.background = 'transparent';
    dialogElement.style.maxWidth = '100vw';
    dialogElement.style.maxHeight = '100vh';
    dialogElement.style.zIndex = `${1000 + this.openDialogs.size}`;

    this.doc.body.appendChild(dialogElement);

    const componentRef = viewContainerRef.createComponent(component);

    if (componentRef.location.nativeElement) {
      dialogElement.appendChild(componentRef.location.nativeElement);
    }

    // تابع پاک‌سازی اختصاصی برای این دیالوگ
    const cleanup = () => {
      if (!this.openDialogs.has(id)) return; // جلوگیری از پاک‌سازی مجدد

      this.openDialogs.delete(id);

      if (componentRef.location.nativeElement?.parentNode) {
        componentRef.location.nativeElement.remove();
      }
      componentRef.destroy();
      dialogElement.remove();

      onClosed?.();
    };

    const instance: DialogInstance = {
      id,
      anchor,
      element: dialogElement,
      componentRef: componentRef as ComponentRef<T>,
      options: options,
      cleanup,
    };

    this.openDialogs.set(id, instance);
    dialogElement.showModal();

    if (configure) {
      const ref = new DialogOverlayRef(componentRef, dialogElement, cleanup);
      configure(componentRef.instance, ref);
    }

    requestAnimationFrame(() => {
      this.positionDialog(instance);
    });

    setTimeout(() => {
      const focusable = dialogElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) {
        (focusable as HTMLElement).focus();
      }
    }, 0);

    const ref = new DialogOverlayRef(componentRef, dialogElement, cleanup);
    return ref;
  }

  private repositionAll() {
    Array.from(this.openDialogs.values()).forEach((instance) => {
      if (instance.anchor && instance.element.isConnected) {
        this.positionDialog(instance);
      }
    });
  }

  private positionDialog(dialogInstance: DialogInstance) {
    const anchor = dialogInstance.anchor;
    const dialog = dialogInstance.element;
    const { placement, alignment, margin = 8 } = dialogInstance.options;

    if (!anchor || !dialog) return;

    const anchorRect = anchor.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isRTL = getComputedStyle(this.doc.documentElement).direction === 'rtl';

    let top = 0;
    let left = 0;

    const spaceBelow = vh - anchorRect.bottom;
    const spaceAbove = anchorRect.top;

    //  Top
    if (placement === 'bottom' || (placement === 'auto' && spaceBelow >= dialogRect.height + margin)) {
      top = anchorRect.bottom + margin;
      if (top + dialogRect.height > vh - margin) {
        top = vh - dialogRect.height - margin;
      }
    } else {
      top = anchorRect.top - dialogRect.height - margin;
      if (top < margin) {
        top = margin;
      }
    }

    //  Left
    if (alignment === 'center') {
      left = anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2;
    } else if (alignment === 'start') {
      left = isRTL ? anchorRect.right - dialogRect.width : anchorRect.left;
    } else {
      // end
      left = isRTL ? anchorRect.left : anchorRect.right - dialogRect.width;
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

  closeAll(): void {
    const ids = Array.from(this.openDialogs.keys());
    ids.forEach((id) => {
      const instance = this.openDialogs.get(id);
      instance?.cleanup();
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
      lastDialog.cleanup();
    }
  }
}
