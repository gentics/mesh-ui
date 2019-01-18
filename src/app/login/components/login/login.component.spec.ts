import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { AuthEffectsService } from '../../providers/auth-effects.service';

import { LoginComponent } from './login.component';

describe('LoginComponent:', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, TestStateModule],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                { provide: Router, useClass: MockRouter },
                { provide: AuthEffectsService, useClass: MockAuthEffects }
            ],
            declarations: [LoginComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        comp = fixture.componentInstance;
        appState = TestBed.get(ApplicationStateService);

        fixture.detectChanges();
    });

    it(`can be created`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    // TODO: actual unit tests
});

class MockAuthEffects {
    login = jasmine.createSpy('login');
}

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}
