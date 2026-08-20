import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursManager } from './cours-manager';

describe('CoursManager', () => {
  let component: CoursManager;
  let fixture: ComponentFixture<CoursManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursManager],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
