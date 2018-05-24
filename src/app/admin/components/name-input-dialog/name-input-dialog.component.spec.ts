import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockI18nPipe } from '../../../shared/pipes/i18n/i18n.pipe.mock';
import { NameInputDialogComponent } from './name-input-dialog.component';

describe('NameInputDialogComponent', () => {
    let component: NameInputDialogComponent;
    let fixture: ComponentFixture<NameInputDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                GenticsUICoreModule.forRoot(),
            ],
            declarations: [
                NameInputDialogComponent,
                MockI18nPipe,
            ],
            providers: [
                { provide: I18nService, useClass: MockI18nService },
                { provide: ConfigService, useClass: MockConfigService },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NameInputDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
