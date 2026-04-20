import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgxInputColor } from 'ngx-input-color/color-picker';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MyComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, NgxInputColor],
      providers: [
        provideZonelessChangeDetection(), // ← Zoneless
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
