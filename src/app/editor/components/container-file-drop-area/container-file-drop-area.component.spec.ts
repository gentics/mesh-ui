import { PipeTransform, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { FileDropArea, GenticsUICoreModule, ModalService } from 'gentics-ui-core';

import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';

import { ContainerFileDropAreaComponent } from './container-file-drop-area.component';
import { By } from '@angular/platform-browser';

describe('ContainerFileDropAreaComponent', () => {
    let component: ContainerFileDropAreaComponent;
    let fixture: ComponentFixture<ContainerFileDropAreaComponent>;
    let modalService: MockModalService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContainerFileDropAreaComponent,
                MockI18nPipe
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ModalService, useClass: MockModalService },
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
            ],
            imports: [
                GenticsUICoreModule
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContainerFileDropAreaComponent);
        component = fixture.componentInstance;
        modalService = TestBed.get(ModalService);
        fixture.detectChanges();
    });

    it('Opens an multiple file upload dialog', fakeAsync(() => {
        const fileDropArea = fixture.debugElement.query(By.directive(FileDropArea));
        fileDropArea.triggerEventHandler('fileDrop', []);
        fixture.detectChanges();
        tick();

        expect(modalService.fromComponent).toHaveBeenCalled();
    }));
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

