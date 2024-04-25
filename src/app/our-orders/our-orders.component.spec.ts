import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurOrdersComponent } from './our-orders.component';

describe('OurOrdersComponent', () => {
  let component: OurOrdersComponent;
  let fixture: ComponentFixture<OurOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
