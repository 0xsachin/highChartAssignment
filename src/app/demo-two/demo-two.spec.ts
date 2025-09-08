import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTwo } from './demo-two';

describe('DemoTwo', () => {
  let component: DemoTwo;
  let fixture: ComponentFixture<DemoTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
