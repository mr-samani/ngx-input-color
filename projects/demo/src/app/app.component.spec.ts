import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgxInputColorModule } from '../../../ngx-input-color/src/public-api';
import { CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

descrbe('Sample App Component', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FormsModule,
         ...
        NgxInputColorModule
      ],
      providers: [
        provideZonelessChangeDetection(),
       // provideUserStoreServiceMock(),
        provideHttpClient(),
        provideHttpClientTesting()
       
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
  });
});

 