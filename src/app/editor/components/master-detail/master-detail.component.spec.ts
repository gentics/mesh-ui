import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterDetailComponent } from './master-detail.component';
import { SharedModule } from '../../../shared/shared.module';

describe('MasterDetailComponent:', () => {

    let comp: MasterDetailComponent;
    let fixture: ComponentFixture<MasterDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [MasterDetailComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MasterDetailComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});
