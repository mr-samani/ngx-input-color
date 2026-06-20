import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogOptions } from './dialog-options';
import { DialogOverlayRef } from './dialog-overlay-ref';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  open<T>(options: DialogOptions<T>): DialogOverlayRef<T> {
    if (!this.document?.body) {
      throw new Error('DialogService can only run in browser.');
    }

    const {
      anchor,
      component,
      viewContainerRef,
      configure,
      margin = 8,
      zIndex = 1000,
      backdropColor = 'rgba(0,0,0,.18)',
      placement = 'auto',
      alignment = 'center',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      onClosed,
    } = options;

    const componentRef = viewContainerRef.createComponent(component);

    const backdropEl = this.document.createElement('div');
    const panelEl = this.document.createElement('div');

    backdropEl.style.cssText = `
      position: fixed;
      inset: 0;
      background: ${backdropColor};
      z-index: ${zIndex};
      overflow: hidden;
    `;

    panelEl.style.cssText = `
      position: fixed;
      z-index: ${zIndex + 1};
      visibility: hidden;
      outline: none;
    `;

    // خود کامپوننت داخل panel قرار می‌گیرد
    panelEl.appendChild(componentRef.location.nativeElement);

    this.document.body.appendChild(backdropEl);
    this.document.body.appendChild(panelEl);

    let closed = false;
    let rafId = 0;

    const cleanup = () => {
      if (closed) return;
      closed = true;

      cancelAnimationFrame(rafId);

      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      this.document.removeEventListener('keydown', onKeyDown);

      backdropEl.removeEventListener('click', onBackdropClick);

      componentRef.destroy();

      panelEl.remove();
      backdropEl.remove();

      onClosed?.();
    };

    const ref = new DialogOverlayRef<T>(componentRef, backdropEl, panelEl, cleanup);

    const onBackdropClick = (e: MouseEvent) => {
      if (!closeOnBackdropClick) return;
      if (e.target === backdropEl) {
        ref.close();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!closeOnEscape) return;
      if (e.key === 'Escape') {
        ref.close();
      }
    };

    backdropEl.addEventListener('click', onBackdropClick);
    this.document.addEventListener('keydown', onKeyDown);

    const reposition = () => {
      if (closed) return;

      const anchorRect = anchor.getBoundingClientRect();
      const panelRect = panelEl.getBoundingClientRect();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isRTL = getComputedStyle(this.document.documentElement).direction === 'rtl';

      let top: number;

      const spaceBelow = vh - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      if (
        placement === 'bottom' ||
        (placement === 'auto' && (spaceBelow >= panelRect.height + margin || spaceBelow >= spaceAbove))
      ) {
        top = anchorRect.bottom + margin;

        if (top + panelRect.height + margin > vh) {
          top = Math.max(margin, vh - panelRect.height - margin);
        }
      } else {
        top = anchorRect.top - panelRect.height - margin;

        if (top < margin) {
          top = margin;
        }
      }

      let left: number;

      if (alignment === 'center') {
        left = anchorRect.left + anchorRect.width / 2 - panelRect.width / 2;
      } else if (!isRTL) {
        left = alignment === 'start' ? anchorRect.left : anchorRect.right - panelRect.width;
      } else {
        left = alignment === 'start' ? anchorRect.right - panelRect.width : anchorRect.left;
      }

      if (left < margin) left = margin;
      if (left + panelRect.width + margin > vw) {
        left = Math.max(margin, vw - panelRect.width - margin);
      }

      panelEl.style.top = `${Math.round(top)}px`;
      panelEl.style.left = `${Math.round(left)}px`;
      panelEl.style.visibility = 'visible';
    };

    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);

    rafId = requestAnimationFrame(reposition);

    if (configure) {
      configure(componentRef.instance, ref);
    }

    return ref;
  }
}
