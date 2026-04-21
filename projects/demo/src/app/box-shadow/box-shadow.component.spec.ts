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
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BoxShadowComponent,FormsModule, NgxInputBoxShadow, NgxBoxShadowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BoxShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
