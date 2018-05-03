import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDropArea, GenticsUICoreModule, ModalService } from 'gentics-ui-core';

import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { ContainerFileDropAreaComponent } from './container-file-drop-area.component';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';

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
                { provide: ConfigService, useClass: MockConfigService },
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

        expect(modalService.fromComponentSpy).toHaveBeenCalled();
    }));
});
