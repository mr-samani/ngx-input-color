/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmykComponent } from './cmyk.component';

describe('CmykComponent', () => {
  let component: CmykComponent;
  let fixture: ComponentFixture<CmykComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmykComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmykComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
