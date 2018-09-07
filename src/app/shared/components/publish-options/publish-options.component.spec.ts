import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishOptionsComponent } from './publish-options.component';

describe('PublishOptionsComponent', () => {
    let component: PublishOptionsComponent;
    let fixture: ComponentFixture<PublishOptionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PublishOptionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PublishOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
