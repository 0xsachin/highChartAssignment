import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoFour } from './demo-four';

describe('DemoFour', () => {
  let component: DemoFour;
  let fixture: ComponentFixture<DemoFour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoFour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoFour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
