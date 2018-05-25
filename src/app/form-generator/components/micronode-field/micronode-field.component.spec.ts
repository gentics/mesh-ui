import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';

import { MicronodeFieldComponent } from './micronode-field.component';

describe('MicronodeFieldComponent:', () => {
    let comp: MicronodeFieldComponent;
    let fixture: ComponentFixture<MicronodeFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MicronodeFieldComponent],
            providers: [FieldGeneratorService, MeshControlGroupService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MicronodeFieldComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });
});
