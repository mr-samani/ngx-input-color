import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaturationComponent } from './saturation.component';

describe('SaturationComponent', () => {
  let component: SaturationComponent;
  let fixture: ComponentFixture<SaturationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaturationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
