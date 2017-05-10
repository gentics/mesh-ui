import { Component } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalService, OverlayHostService } from 'gentics-ui-core';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { StateModule } from '../../../state/state.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { SharedModule } from '../../../shared/shared.module';
import { UserDropdownComponent } from './user-dropdown.component';
import { AuthEffectsService } from '../../../login/providers/auth-effects.service';

describe('UserDropdownComponent:', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [TestComponent, UserDropdownComponent],
            imports: [StateModule, SharedModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: AuthEffectsService, useValue: {} },
                { provide: ModalService, useValue: {} },
                OverlayHostService
            ]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        // Initial language is english
        appState.mockState({
            auth: {
                currentUser: 'd8b043e818144e27b043e81814ae2713'
            },
            entities: {
                user: {
                    'd8b043e818144e27b043e81814ae2713': {
                        uuid: 'd8b043e818144e27b043e81814ae2713',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-05-02T09:06:00Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-05-02T09:06:00Z',
                        lastname: 'Maulwurf',
                        firstname: 'Hans',
                        username: 'HM',
                        enabled: true,
                        groups: [{
                            name: 'Client Group',
                            uuid: '7e0a45aa7cbe471d8a45aa7cbe071d94'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    },
                    'b6f535db1751483ab535db1751e83afe': {
                        uuid: 'b6f535db1751483ab535db1751e83afe',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-05-02T09:05:41Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-05-02T09:05:41Z',
                        username: 'TestUser',
                        enabled: true,
                        groups: [{
                            name: 'Editor Group',
                            uuid: '63ab949103024a43ab94910302fa4325'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }
                }
            }
        });
    });

    it(`shows the first name and last name of the user`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            expect(getDisplayedUsername(fixture)).toBe('Hans Maulwurf');
        })
    );

    it(`shows the username if real name is missing`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                auth: {
                    currentUser: 'b6f535db1751483ab535db1751e83afe'
                }
            });
            fixture.detectChanges();
            expect(getDisplayedUsername(fixture)).toBe('TestUser');
        })
    );

    it(`updates the username if it was changed`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                entities: {
                    user: {
                        'd8b043e818144e27b043e81814ae2713': {
                            uuid: 'd8b043e818144e27b043e81814ae2713',
                            creator: {
                                uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                            },
                            created: '2017-05-02T09:06:00Z',
                            editor: {
                                uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                            },
                            edited: '2017-05-02T09:06:00Z',
                            lastname: 'Maulwurf',
                            firstname: 'Horst',
                            username: 'HM',
                            enabled: true,
                            groups: [{
                                name: 'Client Group',
                                uuid: '7e0a45aa7cbe471d8a45aa7cbe071d94'
                            }],
                            permissions: {
                                create: true,
                                read: true,
                                update: true,
                                delete: true,
                                publish: true,
                                readPublished: true
                            }
                        }
                    }
                }
            });
            fixture.detectChanges();
            expect(getDisplayedUsername(fixture)).toBe('Horst Maulwurf');
        })
    );
});


function getDisplayedUsername(fixture: ComponentFixture<TestComponent>): string {
    return getTextFromElement(fixture.nativeElement.querySelector('gtx-button button'))[0];
}

// TODO move this to general util class
function getTextFromElement(element: HTMLElement): string[] {
    return Array.from(element.childNodes)
        // type 3 is Text
        .filter(node => node.nodeType === 3)
        .map((node: Text) => node.textContent as string)
        .map(text => text.trim())
        .filter(text => text.length > 0);
}

@Component({
    template: `
        <user-dropdown></user-dropdown>`
})
class TestComponent { }

