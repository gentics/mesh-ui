import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerFileDropAreaComponent } from './container-file-drop-area.component';

describe('ContainerFileDropAreaComponent', () => {
  let component: ContainerFileDropAreaComponent;
  let fixture: ComponentFixture<ContainerFileDropAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerFileDropAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerFileDropAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
