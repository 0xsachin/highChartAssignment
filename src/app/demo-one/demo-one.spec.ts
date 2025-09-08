import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoOne } from './demo-one';

describe('DemoOne', () => {
  let component: DemoOne;
  let fixture: ComponentFixture<DemoOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoOne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
