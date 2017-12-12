import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerComponentComponent } from './marker-component.component';

describe('MarkerComponentComponent', () => {
  let component: MarkerComponentComponent;
  let fixture: ComponentFixture<MarkerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
