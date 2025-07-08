/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RgbComponent } from './rgb.component';

describe('RgbComponent', () => {
  let component: RgbComponent;
  let fixture: ComponentFixture<RgbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
