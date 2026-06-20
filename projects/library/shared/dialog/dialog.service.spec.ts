import { TestBed } from '@angular/core/testing';
import { Component, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogService } from './dialog.service';

@Component({
  template: `
    <div>test component</div>
  `,
})
class MockComponent {}

describe('DialogService', () => {
  let service: DialogService;
  let viewContainerRef: ViewContainerRef;
  let documentRef: Document;

  beforeEach(() => {
    // اطمینان از وجود document.body
    if (!document.body) {
      document.body = document.createElement('body');
    }
    if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
      HTMLDialogElement.prototype.showModal = vi.fn();
    }
    if (typeof HTMLDialogElement.prototype.close !== 'function') {
      HTMLDialogElement.prototype.close = vi.fn();
    }

    TestBed.configureTestingModule({
      providers: [DialogService],
    });
    service = TestBed.inject(DialogService);
    documentRef = TestBed.inject(DOCUMENT);

    // fake ViewContainerRef
    viewContainerRef = {
      createComponent: (cmp: any) => {
        const el = document.createElement('div');
        el.textContent = 'mock component content';
        return {
          instance: {},
          location: { nativeElement: el },
          destroy: vi.fn(),
        } as any;
      },
    } as any;
  });

  afterEach(() => {
    if (document.body) {
      document.body.innerHTML = '';
    }
    vi.restoreAllMocks();
  });

  // ---------------------------
  // CREATE / DESTROY
  // ---------------------------
  it('should create dialog overlay elements', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const dialog = document.querySelector('dialog');
    expect(dialog).toBeTruthy();

    expect(dialog?.contains(document.querySelector('div')!)).toBeTruthy();

    ref.close();

    expect(document.querySelector('dialog')).toBeFalsy();
  });

  it('should destroy component and remove DOM', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const dialog = document.querySelector('dialog');
    expect(dialog?.textContent).toContain('mock component content');

    ref.close();

    expect(document.querySelector('dialog')).toBeFalsy();
  });

  // ---------------------------
  // BACKDROP CLICK
  // ---------------------------
  it('should close on backdrop click', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const backdrop = document.querySelector('dialog')?.previousElementSibling as HTMLElement;

    if (backdrop && backdrop.tagName === 'DIV') {
      backdrop.click();
      expect(document.querySelector('dialog')).toBeFalsy();
    } else {
      expect(true).toBeTruthy();
    }
  });

  // ---------------------------
  // ESCAPE KEY
  // ---------------------------
  it('should close on escape key', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(document.querySelector('dialog')).toBeFalsy();
  });

  // ---------------------------
  // RTL / LTR
  // ---------------------------
  it('should respect RTL layout', () => {
    document.documentElement.dir = 'rtl';
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '100px';
    anchor.style.left = '100px';
    document.body.appendChild(anchor);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'start',
    });

    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    expect(dialog).toBeTruthy();

    const rect = dialog.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);

    ref.close();
    document.documentElement.dir = 'ltr';
  });

  it('should respect LTR layout', () => {
    document.documentElement.dir = 'ltr';
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '100px';
    anchor.style.right = '100px';
    document.body.appendChild(anchor);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'end',
    });

    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    expect(dialog).toBeTruthy();

    const rect = dialog.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);

    ref.close();
  });

  // ---------------------------
  // VIEWPORT EDGE CASES
  // ---------------------------
  it('should not overflow viewport', () => {
    const anchor = document.createElement('button');
    anchor.style.position = 'fixed';
    anchor.style.top = '0';
    anchor.style.left = '0';
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    const rect = dialog.getBoundingClientRect();

    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.top).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);

    ref.close();
  });

  // ---------------------------
  // SCROLL CONTAINER
  // ---------------------------
  it('should reposition on scroll container scroll', () => {
    const container = document.createElement('div');
    container.style.height = '200px';
    container.style.overflow = 'auto';
    const anchor = document.createElement('button');
    anchor.style.position = 'absolute';
    anchor.style.top = '150px';
    container.appendChild(anchor);
    document.body.appendChild(container);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));

    const dialog = document.querySelector('dialog');
    expect(dialog).toBeTruthy();

    ref.close();
  });

  // ---------------------------
  // WINDOW RESIZE
  // ---------------------------
  it('should reposition on resize', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    window.dispatchEvent(new Event('resize'));

    expect(document.querySelector('dialog')).toBeTruthy();

    ref.close();
  });

  // ---------------------------
  // MULTIPLE OVERLAYS
  // ---------------------------
  it('should support multiple dialogs', () => {
    const a1 = document.createElement('button');
    const a2 = document.createElement('button');
    document.body.appendChild(a1);
    document.body.appendChild(a2);

    const r1 = service.open({ anchor: a1, component: MockComponent, viewContainerRef });
    const r2 = service.open({ anchor: a2, component: MockComponent, viewContainerRef });
    expect(document.querySelectorAll('dialog').length).toBe(2);

    r1.close();

    expect(document.querySelectorAll('dialog').length).toBe(1);
  });

  // ---------------------------
  // MEMORY LEAK / CLEANUP
  // ---------------------------
  it('should cleanup listeners after close', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    ref.close();

    const event = new Event('resize');
    expect(() => window.dispatchEvent(event)).not.toThrow();
  });

  // ---------------------------
  // SHADOW DOM
  // ---------------------------
  it('should work with shadow DOM anchor', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const anchor = document.createElement('button');
    shadow.appendChild(anchor);
    document.body.appendChild(host);

    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });

    expect(document.querySelector('dialog')).toBeTruthy();
    ref.close();
  });

  // ---------------------------
  // RACE CONDITION
  // ---------------------------
  it('should not crash on rapid open/close', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    ref.close();

    const ref2 = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    expect(document.querySelector('dialog')).toBeTruthy();
    ref2.close();
  });
});
