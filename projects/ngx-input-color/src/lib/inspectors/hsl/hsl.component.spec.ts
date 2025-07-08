/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HslComponent } from './hsl.component';

describe('HslComponent', () => {
  let component: HslComponent;
  let fixture: ComponentFixture<HslComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HslComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
