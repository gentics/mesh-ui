import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { provideMockI18n, configureComponentTest } from '../../../../testing/configure-component-test';
import { CreateTagDialogComponent } from './create-tag-dialog.component';
import { ConfigService } from '../../../core/providers/config/config.service';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

describe('CreateTagDialogComponent', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;
  let tagsEffecsService: MockTagsEffectsService;


  beforeEach(() => {
    configureComponentTest({
      declarations: [
        CreateTagDialogComponent,
        MockI18nPipe
      ],
      providers: [
        OverlayHostService,
        { provide: TagsEffectsService, useClass: MockTagsEffectsService },
        { provide: ApplicationStateService, useClass: TestApplicationState },
        { provide: I18nService, useClass: MockI18nService },
        { provide: ConfigService, useValue: { CONTENT_LANGUAGES: [] } },
      ],
      imports: [
        FormsModule,
        GenticsUICoreModule
      ]
    });

    tagsEffecsService = TestBed.get(TagsEffectsService);
    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new family', fakeAsync(() => {
    component.closeFn = jasmine.createSpy('closeFn');
    fixture.componentInstance.inputTagFamilyValue = 'new family name';
    fixture.componentInstance.newTagName = 'new name';

    const buttonSave = fixture.debugElement.query(By.css('.button_save'));
    buttonSave.triggerEventHandler('click', null);
    expect(tagsEffecsService.createTagFamily).toHaveBeenCalled();
  }));


  it('should create new node', fakeAsync(() => {
    component.closeFn = jasmine.createSpy('closeFn');
    fixture.componentInstance.inputTagFamilyValue = 'new family name';
    fixture.componentInstance.newTagName = 'new name';

    const buttonSave = fixture.debugElement.query(By.css('.button_save'));
    buttonSave.triggerEventHandler('click', null);
    tick();
    expect(tagsEffecsService.createTag).toHaveBeenCalled();
  }));

});

class MockTagsEffectsService {
    createTag = jasmine.createSpy('createTag').and.returnValue(Promise.resolve({uuid: 'new_node_uuid'}));
    createTagFamily = jasmine.createSpy('createTagFamily').and.returnValue(Promise.resolve({uuid: 'new_family_uuid'}));
}

class MockI18nService {
  translate(str: string): string {
    return str;
  }
}


@Pipe({
  name: 'i18n'
})
class MockI18nPipe implements PipeTransform {
  transform(arg) {
    return `translated ${arg}`;
  }
}

