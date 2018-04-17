import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ModalService, GenticsUICoreModule } from 'gentics-ui-core';

import { MockI18nService } from '../../../core/providers/i18n/i18n.service.mock';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';

import { ConflictedFieldComponent } from './conflicted-field.component';

describe('ConflictedFieldComponent', () => {
  let component: ConflictedFieldComponent;
  let fixture: ComponentFixture<ConflictedFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          ConflictedFieldComponent,
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
    fixture = TestBed.createComponent(ConflictedFieldComponent);
    component = fixture.componentInstance;
    component.conflictedField = {
        field: { type: '__TAGS__', name: 'somename' },
        mineValue: 'somavalue',
        theirValue: 'somevalue',
        overwrite: false,
        conflictedFields: []
    };
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
