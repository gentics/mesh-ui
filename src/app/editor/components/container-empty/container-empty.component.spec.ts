import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerEmptyComponent } from './container-empty.component';

describe('ContainerEmptyComponent', () => {
    let component: ContainerEmptyComponent;
    let fixture: ComponentFixture<ContainerEmptyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContainerEmptyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContainerEmptyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
