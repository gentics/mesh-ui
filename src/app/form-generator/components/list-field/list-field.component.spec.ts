import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule, SortableList } from 'gentics-ui-core';

import { ListFieldComponent } from './list-field.component';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import { ScrollFrameHeadingDirective } from '../../../shared/components/scroll-frame/scroll-frame-heading.directive';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { ScrollFrameDirective } from '../../../shared/components/scroll-frame/scroll-frame.directive';

describe('ListFieldComponent', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: ListFieldComponent;

    beforeEach(() => {
        configureComponentTest({
            imports: [
                GenticsUICoreModule,
                TestStateModule
            ],
            declarations: [
                TestHostComponent,
                ListFieldComponent,
                ScrollFrameDirective,
                ScrollFrameHeadingDirective
            ],
            providers: [
                { provide: FieldGeneratorService, useClass: MockFieldGeneratorService },
                { provide: MeshControlGroupService, useClass: MockMeshControlGroupService }
            ]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.debugElement.query(By.directive(ListFieldComponent)).componentInstance;
    });

    it('does not display the add-item-button when in readOnly mode', () => {
        const api = new MockMeshFieldControlApi();
        api.readOnly = true;
        instance.init(api);
        fixture.detectChanges();

        const addItemButton = fixture.debugElement.query(By.css('.add-item-button'));

        expect(addItemButton === null).toBe(true);
    });
    it('does not display the remove area when in readOnly mode', () => {
        const api = new MockMeshFieldControlApi();
        api.readOnly = true;
        instance.init(api);
        fixture.detectChanges();

        const addItemButton = fixture.debugElement.query(By.css('.remove-area-wrapper'));

        expect(addItemButton === null).toBe(true);
    });

    it('the sortable list is disabled in readOnly mode', () => {
        const api = new MockMeshFieldControlApi();
        api.readOnly = true;
        instance.init(api);
        fixture.detectChanges();

        const sortableList: SortableList = fixture.debugElement.query(By.css('.list-container gtx-sortable-list')).componentInstance;

        expect(sortableList.disabled).toBe(true);
    });

});

@Component({
    selector: 'test-host',
    template: `
        <div scrollFrame>
            <list-field></list-field>
        </div>`
})
class TestHostComponent {}

class MockFieldGeneratorService {
    create = jasmine.createSpy('create');
}
class MockMeshControlGroupService {
    getMeshControlAtPath = jasmine.createSpy('getMeshControlAtPath');
}
