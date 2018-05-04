import { NgModule } from '@angular/core';

import { ConfigService } from '../../core/providers/config/config.service';
import { ApplicationStateService } from '../providers/application-state.service';
import { EntitiesService } from '../providers/entities.service';

import { TestApplicationState } from './test-application-state.mock';

/**
 * This should be used in tests for components which interact with the app state in some way.
 * Just `import` this module, and then there is no need to declare and other state providers in the
 * test file itself.
 */
@NgModule({
    providers: [{ provide: ApplicationStateService, useClass: TestApplicationState }, EntitiesService, ConfigService]
})
export class TestStateModule {}
