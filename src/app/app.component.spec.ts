import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { never as observableNever, Observable } from 'rxjs';

import { AppComponent } from './app.component';
import { ConfigService } from './core/providers/config/config.service';
import { MockConfigService } from './core/providers/config/config.service.mock';
import { SharedModule } from './shared/shared.module';
import { ApplicationStateDevtools } from './state/providers/application-state-devtools';
import { ApplicationStateService } from './state/providers/application-state.service';

describe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, SharedModule, GenticsUICoreModule.forRoot()],
            declarations: [AppComponent],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                ApplicationStateService,
                ApplicationStateDevtools,
                { provide: Router, useClass: MockRouter }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it(`should be readily initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });
});

class MockRouter {
    events = observableNever();
}
