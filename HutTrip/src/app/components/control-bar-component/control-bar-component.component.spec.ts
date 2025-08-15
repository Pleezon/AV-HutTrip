import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlBarComponentComponent } from './control-bar-component.component';

describe('ControlBarComponentComponent', () => {
  let component: ControlBarComponentComponent;
  let fixture: ComponentFixture<ControlBarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlBarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlBarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
