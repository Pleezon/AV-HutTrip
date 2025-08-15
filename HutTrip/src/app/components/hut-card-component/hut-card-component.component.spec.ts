import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HutCardComponentComponent } from './hut-card-component.component';

describe('HutCardComponentComponent', () => {
  let component: HutCardComponentComponent;
  let fixture: ComponentFixture<HutCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HutCardComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HutCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
