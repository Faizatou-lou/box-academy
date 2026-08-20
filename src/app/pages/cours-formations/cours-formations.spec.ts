import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursFormations } from './cours-formations';

describe('CoursFormations', () => {
  let component: CoursFormations;
  let fixture: ComponentFixture<CoursFormations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursFormations],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursFormations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
