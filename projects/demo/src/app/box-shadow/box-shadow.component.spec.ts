/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoxShadowComponent } from './box-shadow.component';
import { NgxBoxShadowComponent, NgxInputBoxShadow } from 'ngx-input-color/box-shadow';
import { FormsModule } from '@angular/forms';

describe('BoxShadowComponent', () => {
  let component: BoxShadowComponent;
  let fixture: ComponentFixture<BoxShadowComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    TestBed.configureTestingModule({
      declarations: [],
      imports: [BoxShadowComponent, FormsModule, NgxInputBoxShadow, NgxBoxShadowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BoxShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
