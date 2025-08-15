import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HutListComponentComponent } from './hut-list-component.component';

describe('HutListComponentComponent', () => {
  let component: HutListComponentComponent;
  let fixture: ComponentFixture<HutListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HutListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HutListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
