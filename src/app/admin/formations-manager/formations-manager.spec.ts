import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsManager } from './formations-manager';

describe('FormationsManager', () => {
  let component: FormationsManager;
  let fixture: ComponentFixture<FormationsManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationsManager],
    }).compileComponents();

    fixture = TestBed.createComponent(FormationsManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
