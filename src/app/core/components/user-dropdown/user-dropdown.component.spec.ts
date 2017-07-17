import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService, OverlayHostService } from 'gentics-ui-core';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { StateModule } from '../../../state/state.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { SharedModule } from '../../../shared/shared.module';
import { UserDropdownComponent } from './user-dropdown.component';
import { AuthEffectsService } from '../../../login/providers/auth-effects.service';
import { mockUser } from '../../../../testing/mock-models';

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
                    d8b043e818144e27b043e81814ae2713: mockUser({
                        uuid: 'd8b043e818144e27b043e81814ae2713',
                        lastname: 'Maulwurf',
                        firstname: 'Hans',
                        username: 'HM'
                    }),
                    b6f535db1751483ab535db1751e83afe: mockUser({
                        uuid: 'b6f535db1751483ab535db1751e83afe',
                        username: 'TestUser',
                        firstname: undefined,
                        lastname: undefined
                    })
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
                        d8b043e818144e27b043e81814ae2713: mockUser({
                            uuid: 'd8b043e818144e27b043e81814ae2713',
                            lastname: 'Maulwurf',
                            firstname: 'Horst',
                            username: 'HM'
                        })
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

