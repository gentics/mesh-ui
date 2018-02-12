import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTagsBarComponent } from './node-tags-bar.component';

describe('NodeTagsBarComponent', () => {
  let component: NodeTagsBarComponent;
  let fixture: ComponentFixture<NodeTagsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeTagsBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTagsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
