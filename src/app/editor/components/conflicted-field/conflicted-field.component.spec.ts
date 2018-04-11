import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictedFieldComponent } from './conflicted-field.component';

describe('ConflictedFieldComponent', () => {
  let component: ConflictedFieldComponent;
  let fixture: ComponentFixture<ConflictedFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConflictedFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
