import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteeditComponent } from './routeedit.component';

describe('RouteeditComponent', () => {
  let component: RouteeditComponent;
  let fixture: ComponentFixture<RouteeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
