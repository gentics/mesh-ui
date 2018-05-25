import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';

import { PaginationControlsComponent } from './pagination-controls.component';

describe('PaginationControlsComponent', () => {
    let component: PaginationControlsComponent;
    let fixture: ComponentFixture<PaginationControlsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationControlsComponent],
            imports: [NgxPaginationModule]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationControlsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
