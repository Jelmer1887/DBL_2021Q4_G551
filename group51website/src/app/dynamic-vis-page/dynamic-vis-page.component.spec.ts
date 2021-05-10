import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicVisPageComponent } from './dynamic-vis-page.component';

describe('DynamicVisPageComponent', () => {
  let component: DynamicVisPageComponent;
  let fixture: ComponentFixture<DynamicVisPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicVisPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicVisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
