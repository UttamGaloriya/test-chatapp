import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerivewFileComponent } from './perivew-file.component';

describe('PerivewFileComponent', () => {
  let component: PerivewFileComponent;
  let fixture: ComponentFixture<PerivewFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerivewFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerivewFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
