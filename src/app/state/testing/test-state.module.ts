import { NgModule } from '@angular/core';
import { ApplicationStateService } from '../providers/application-state.service';
import { TestApplicationState } from './test-application-state.mock';
import { EntitiesService } from '../providers/entities.service';
import { ConfigService } from '../../core/providers/config/config.service';

/**
 * This should be used in tests for components which interact with the app state in some way.
 * Just `import` this module, and then there is no need to declare and other state providers in the
 * test file itself.
 */
@NgModule({
    providers: [
        { provide: ApplicationStateService, useClass: TestApplicationState},
        EntitiesService,
        { provide: ConfigService, useValue: { FALLBACK_LANGUAGE: 'en' } }
    ]
})
export class TestStateModule {}
