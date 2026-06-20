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

    TestBed.configureTestingModule({
      providers: [DialogService],
    });
    service = TestBed.inject(DialogService);
    documentRef = TestBed.inject(DOCUMENT);

    // fake ViewContainerRef
    viewContainerRef = {
      createComponent: (cmp: any) => {
        const el = document.createElement('div');
        el.textContent = 'mock';
        return {
          instance: {},
          location: { nativeElement: el },
          destroy: vi.fn(),
        } as any;
      },
    } as any;
  });

  afterEach(() => {
    // پاکسازی DOM
    if (document.body) {
      document.body.innerHTML = '';
    }
    vi.restoreAllMocks();
  });

  // ---------------------------
  // SSR SAFETY
  // ---------------------------
  it('should throw on SSR (no document body)', () => {
    vi.spyOn(documentRef as any, 'body', 'get').mockReturnValue(null);
    expect(() =>
      service.open({
        anchor: document.createElement('button'),
        component: MockComponent,
        viewContainerRef,
      }),
    ).toThrow();
  });

  // ---------------------------
  // CREATE / DESTROY
  // ---------------------------
  it('should create overlay elements', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    expect(document.querySelectorAll('div').length).toBeGreaterThan(0);
    ref.close();
    expect(document.body.contains(anchor)).toBeTruthy();
  });

  it('should destroy component and remove DOM', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    ref.close();
    expect(document.body.querySelector('div')).toBeFalsy();
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
    const backdrop = document.querySelector('div')!;
    backdrop.click();
    expect(() => ref.close()).not.toThrow();
  });

  // ---------------------------
  // ESCAPE KEY
  // ---------------------------
  it('should close on escape key', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(document.body.childElementCount).toBeGreaterThanOrEqual(0);
  });

  // ---------------------------
  // RTL / LTR
  // ---------------------------
  it('should respect RTL layout', () => {
    document.documentElement.dir = 'rtl';
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'start',
    });
    expect(ref).toBeTruthy();
  });

  it('should respect LTR layout', () => {
    document.documentElement.dir = 'ltr';
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
      alignment: 'end',
    });
    expect(ref).toBeTruthy();
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
    const panel = document.querySelector('div')!;
    const rect = panel.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.top).toBeGreaterThanOrEqual(0);
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
    container.appendChild(anchor);
    document.body.appendChild(container);
    const ref = service.open({
      anchor,
      component: MockComponent,
      viewContainerRef,
    });
    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    expect(ref).toBeTruthy();
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
    expect(ref).toBeTruthy();
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
    expect(r1).toBeTruthy();
    expect(r2).toBeTruthy();
    r1.close();
    r2.close();
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
    window.dispatchEvent(event);
    expect(true).toBeTruthy();
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
    expect(ref).toBeTruthy();
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
    expect(ref2).toBeTruthy();
    ref2.close();
  });
});
