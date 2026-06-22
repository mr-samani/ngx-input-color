/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
 import { FormsModule } from '@angular/forms';
import { AngleSelectorComponent } from './angle-selector.component';
import { NgxAngleSelectorComponent, NgxInputAngle } from 'ngx-input-color/angle-selector';

describe('AngleSelectorComponent', () => {
  let component: AngleSelectorComponent;
  let fixture: ComponentFixture<AngleSelectorComponent>;

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
      imports: [AngleSelectorComponent, FormsModule, NgxInputAngle, NgxAngleSelectorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AngleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
