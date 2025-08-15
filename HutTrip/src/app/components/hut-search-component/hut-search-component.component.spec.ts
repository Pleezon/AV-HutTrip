import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HutSearchComponentComponent } from './hut-search-component.component';

describe('HutSearchComponentComponent', () => {
  let component: HutSearchComponentComponent;
  let fixture: ComponentFixture<HutSearchComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HutSearchComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HutSearchComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
