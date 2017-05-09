import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminShellComponent } from './admin-shell.component';

describe('AdminShellComponent', () => {

    let comp: AdminShellComponent;
    let fixture: ComponentFixture<AdminShellComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminShellComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminShellComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
