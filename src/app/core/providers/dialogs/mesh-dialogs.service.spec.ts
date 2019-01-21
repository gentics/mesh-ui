import { inject, TestBed } from '@angular/core/testing';

import { CoreModule } from '../../core.module';
import { MockConfigService } from '../config/config.service.mock';

import { ConfigService } from './../config/config.service';
import { MeshDialogsService } from './mesh-dialogs.service';

describe('MeshDialogsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [{ provide: ConfigService, useClass: MockConfigService }, MeshDialogsService]
        });
    });

    it(
        'should be created',
        inject([MeshDialogsService], (service: MeshDialogsService) => {
            expect(service).toBeTruthy();
        })
    );
});
