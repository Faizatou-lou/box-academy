import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionsManager } from './inscriptions-manager';

describe('InscriptionsManager', () => {
  let component: InscriptionsManager;
  let fixture: ComponentFixture<InscriptionsManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionsManager],
    }).compileComponents();

    fixture = TestBed.createComponent(InscriptionsManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
