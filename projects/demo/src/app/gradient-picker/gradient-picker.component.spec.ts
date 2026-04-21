/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GradientPickerComponent } from './gradient-picker.component';
import { NgxInputGradient, NgxInputGradientComponent } from 'ngx-input-color/gradient-picker';
import { FormsModule } from '@angular/forms';

describe('GradientPickerComponent', () => {
  let component: GradientPickerComponent;
  let fixture: ComponentFixture<GradientPickerComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [GradientPickerComponent,FormsModule, NgxInputGradient, NgxInputGradientComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GradientPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
