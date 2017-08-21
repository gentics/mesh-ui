import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InstructionActions, NavigationService } from './navigation.service';
import createSpy = jasmine.createSpy;

describe('NavigationService', () => {

    let navigationService: NavigationService;
    let router: MockRouter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NavigationService,
                { provide: Router, useClass: MockRouter }
            ]
        });
        navigationService = TestBed.get(NavigationService);
        router = TestBed.get(Router);
    });

    describe('list()', () => {

        let result: InstructionActions;
        const projectName = 'foo';
        const containerUuid = 'test_uuid';
        const expectedCommands = [
            '/editor', 'project', {
                outlets: {
                    list: [projectName, containerUuid]
                }
            }
        ];

        beforeEach(() => {
            result = navigationService.list(projectName, containerUuid);
        });

        it('commands() should return the correct commands', () => {
            expect(result.commands()).toEqual(expectedCommands);
        });

        it('navigate() should invoke router.navigate() with correct commands', () => {
            const extras: any = {};
            result.navigate(extras);
            expect(router.navigate.calls.argsFor(0)[0]).toEqual(expectedCommands);
            expect(router.navigate.calls.argsFor(0)[1]).toEqual(extras);
        });

    });

    describe('detail()', () => {

        let result: InstructionActions;
        const projectName = 'foo';
        const nodeUuid = 'test_uuid';
        const lang = 'en';
        const expectedCommands = [
            '/editor', 'project', {
                outlets: {
                    detail: [projectName, nodeUuid, lang]
                }
            }
        ];

        beforeEach(() => {
            result = navigationService.detail(projectName, nodeUuid, lang);
        });

        it('commands() should return the correct commands', () => {
            expect(result.commands()).toEqual(expectedCommands);
        });

        it('navigate() should invoke router.navigate() with correct commands', () => {
            const extras: any = {};
            result.navigate(extras);
            expect(router.navigate.calls.argsFor(0)[0]).toEqual(expectedCommands);
            expect(router.navigate.calls.argsFor(0)[1]).toEqual(extras);
        });

    });

    describe('clearDetail()', () => {

        let result: InstructionActions;
        const expectedCommands = [
            '/editor', 'project', {
                outlets: {
                    detail: null
                }
            }
        ];

        beforeEach(() => {
            result = navigationService.clearDetail();
        });

        it('commands() should return the correct commands', () => {
            expect(result.commands()).toEqual(expectedCommands);
        });

        it('navigate() should invoke router.navigate() with correct commands', () => {
            const extras: any = {};
            result.navigate(extras);
            expect(router.navigate.calls.argsFor(0)[0]).toEqual(expectedCommands);
            expect(router.navigate.calls.argsFor(0)[1]).toEqual(extras);
        });

    });
});

class MockRouter {
    navigate = createSpy('navigate');
}
