import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { ApiBase } from './api-base.service';
import { AuthApi } from './auth-api.class';
import { MockApiBase } from './api-base.mock';
import { ProjectApi } from './project-api.class';
import { UserApi } from './user-api.class';


describe('ApiService', () => {

    let api: ApiService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ApiService,
                { provide: ApiBase, useClass: MockApiBase }
            ]
        });

        api = TestBed.get(ApiService);
    });

    it('can be created', () => {
        expect(api).toBeDefined();
        api.project.getProjectMicroschemas({ project: 'myproject' });
    });

    it('has an AuthApi instance as "auth"', () => {
        expect(api.auth instanceof AuthApi).toBe(true);
    });

    it('has a ProjectApi instance as "project"', () => {
        expect(api.project instanceof ProjectApi).toBe(true);
    });

    it('has a UserApi instance as "user"', () => {
        expect(api.user instanceof UserApi).toBe(true);
    });

});
