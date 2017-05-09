import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { AppComponent } from './app.component';
import { ApplicationStateService } from './state/providers/application-state.service';
import { SharedModule } from './shared/shared.module';

describe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                GenticsUICoreModule.forRoot()
            ],
            declarations: [AppComponent],
            providers: [
                ApplicationStateService,
                { provide: Router, useClass: MockRouter }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp    = fixture.componentInstance;

        fixture.detectChanges();
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

});

class MockRouter {
    events = Observable.never();
}
