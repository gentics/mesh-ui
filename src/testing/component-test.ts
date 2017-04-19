import {ComponentFixture, fakeAsync, TestBed, getTestBed} from '@angular/core/testing';

/**
 * Use to test a component in one consistent way. The passed callback
 * will be wrapped in a `fakeAsync` zone and receive a ComponentFixture and an
 * instance of the component under test.
 *
 * The passed callback will be called for the test and may return a Promise
 * that succeeds/fails the unit test on resolve/reject.
 *
 * When the regular angular tests fail to catch errors and passes tests
 * that should fail, we wrap the whole angular code with a try..catch block
 * and mark those tests as failed as they should be.
 *
 * In the case of an angular update, when anything related to component tests
 * needs to be updated, only this function needs to change.
 */
export function componentTest<T>(
        forComponent: () => ComponentType<T>,
        test: (fixture: ComponentFixture<T>, instance: T) => (void | Promise<any>)
    ): () => void;

/**
 * Defines a component unit test with a different template.
 */
export function componentTest<T>(
        forComponent: () => ComponentType<T>,
        template: string,
        test: (fixture: ComponentFixture<T>, instance: T) => (void | Promise<any>)
    ): () => void;

/**
 * Defines a component unit test with TestComponentBuilder overwrites,
 * e.g. using different providers / templates / directives.
 */
export function componentTest<T>(
        forComponent: () => ComponentType<T>,
        overwrites: (testBed: TestBed) => TestBed,
        test: (fixture: ComponentFixture<T>, instance: T) => (void | Promise<any>)
    ): () => void;

export function componentTest<T>(componentFn: () => ComponentType<T>, second: any, third?: any): () => void {
    let args = Array.from(arguments);
    return () => {
        // Parse possible combination of arguments
        let {template, overwritesFn, testFn} = parseOverloadArguments(args);

        let fakeAsyncTest = fakeAsync(() => {
            let testBed: TestBed = getTestBed();
            let componentType: ComponentType<T> = componentFn();

            if (overwritesFn) {
                testBed = overwritesFn(testBed) || testBed;
            } else if (template) {
                testBed.overrideComponent(componentType, { set: { template } });
            }

            let fixture = testBed.createComponent(componentType);
            if (!fixture || !fixture.componentInstance) {
                throw new Error('Component ' + (<any> componentType).name + ' can not be created.');
            }

            Promise.resolve()
                .then(() => testFn(fixture, fixture ? fixture.componentInstance : null))
                .then(
                    () => fixture.destroy(),
                    (reason: any) => {
                        fixture.destroy();
                        return Promise.reject(reason);
                    }
                );
        });

        return fakeAsyncTest();
    };
}

export interface ComponentType<T> {
    new (...args: any[]): T;
}

function parseOverloadArguments<T>(args: any[]): {
                                       template?: string,
                                       overwritesFn?: (testBed: TestBed) => TestBed,
                                       testFn: (fixture: ComponentFixture<T>, instance: T | null) => (void | Promise<any>)
                                   } {
    if (typeof args[1] === 'function' && !args[2]) {
        return { testFn: args[1] };
    } else if (typeof args[1] === 'string') {
        return { template: args[1], testFn: args[2] };
    } else if (typeof args[1] === 'function' && typeof args[2] === 'function') {
        return { overwritesFn: args[1], testFn: args[2] };
    } else {
        throw new Error('Invalid arguments for component test [' + args.map(a => typeof a).join(', ') + ']');
    }
}
