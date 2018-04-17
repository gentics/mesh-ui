import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NodeConflictDialogComponent } from './node-conflict-dialog.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { Pipe, PipeTransform } from '@angular/core';
import { ConflictedFieldComponent } from '../conflicted-field/conflicted-field.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { BlobService } from '../../providers/blob.service';
import { MockBlobService } from '../../providers/blob.service.mock';
import { ApiService } from '../../../core/providers/api/api.service';
import { MockApiService } from '../../../core/providers/api/api.service.mock';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { MockApiBase } from '../../../core/providers/api/api-base.mock';
import { HttpClient } from '@angular/common/http';


fdescribe('NodeConflictDialogComponent', () => {
    let component: NodeConflictDialogComponent;
    let fixture: ComponentFixture<NodeConflictDialogComponent>;

    //const httpMock = TestBed.get(HttpTestingController);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NodeConflictDialogComponent,
                ConflictedFieldComponent,
                MockI18nPipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: EntitiesService, useClass: MockEntitiesService },
                { provide: BlobService, useClass: MockBlobService },
                { provide: ApiService, useClass: MockApiService },
                { provide: ApiBase, useClass: MockApiBase },

            ],
            imports: [
                GenticsUICoreModule,
                HttpClientTestingModule
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeConflictDialogComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


@Pipe({
    name: 'i18n'
})
class MockI18nPipe implements PipeTransform {
    transform(arg) {
        return `translated ${arg}`;
    }
}

class MockModalService {
    dialog = jasmine.createSpy('dialog').and.callFake(() => Promise.resolve(this.fakeDialog));
    fromComponent = jasmine.createSpy('fromComponent').and.callFake(() => Promise.resolve(this.fakeDialog));
    fakeDialog = {
        open: jasmine.createSpy('open').and.callFake(() => {
            return new Promise(resolve => {
                this.confirmLastModal = () => { resolve(); tick(); };
            });
        })
    };
    confirmLastModal: () => void;
}
class MockEntitiesService { }
