import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxInputColorComponent } from './ngx-input-color.component';

describe('NgxInputColorComponent', () => {
  let component: NgxInputColorComponent;
  let fixture: ComponentFixture<NgxInputColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxInputColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxInputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
