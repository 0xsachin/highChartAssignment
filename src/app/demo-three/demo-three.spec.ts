import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoThree } from './demo-three';

describe('DemoThree', () => {
  let component: DemoThree;
  let fixture: ComponentFixture<DemoThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoThree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoThree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
