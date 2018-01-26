import { Icon, Button, GenticsUICoreModule, FilePicker, InputField } from 'gentics-ui-core';
import { MockApiService } from '../../../../core/providers/api/api.service.mock';
import { configureComponentTest } from '../../../../../testing/configure-component-test';
import { componentTest } from '../../../../../testing/component-test';
import { BinaryFieldComponent } from './binary-field.component';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { ApiService } from '../../../../core/providers/api/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MockMeshFieldControlApi } from '../../testing/mock-mesh-field-control-api';
import { ChangeDetectorRef } from '@angular/core';

describe('BinaryFieldComponent:', () => {

    let api: MockApiService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                BinaryFieldComponent,
            ],
            providers: [
                { provide: ApiService, useClass: MockApiService },
                { provide: DomSanitizer, useClass: MockSanitizer },
            ],
            imports: [
                GenticsUICoreModule,
                RouterTestingModule.withRoutes([])
            ]
        });

        api = TestBed.get(ApiService);
    });


    describe('Clicking file upload', () => {
        it('triggers the valueChange handler',
            componentTest(() => TestComponent, (fixture, instance) => {
                /*fixture.detectChanges();
                tick();

                const filePickerButton = fixture.debugElement.query(By.directive(FilePicker));
                filePickerButton.triggerEventHandler('change', 'some value');
                fixture.detectChanges();
                expect(instance.onFilesSelected).toHaveBeenCalled();*/
            })
        );
    });
});

@Component({
    template: `<binary-field></binary-field>`
})
class TestComponent {
    onFilesSelected = jasmine.createSpy('onFilesSelected');
    init = (api: MeshFieldControlApi): void => { console.log('i got called ')};
}

class MockSanitizer {
    bypassSecurityTrustUrl(url: string): string {
        return url;
    }
}
