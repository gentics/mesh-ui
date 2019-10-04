import { Observable, Subscription } from 'rxjs';

import { AppState } from '../models/app-state.model';
import { ApplicationStateService } from '../providers/application-state.service';

/** Only available in testing. A partial type that can be used to mock application state. */
export type MockAppState = Partial<AppState> | TwoLevelsPartial<AppState>;

/** ApplicationStateService for tests. */
export class TestApplicationState extends ApplicationStateService {
    /** Only available in testing. All tracked method calls will be saved in this array. */
    public trackedActionCalls: Array<{ method: string; args: any[] }> = [];

    /** Only available in testing. All subscribed select() calls will be saved in this array. */
    private trackedSubscriptions: Array<(state: AppState) => any> = [];

    /** Only available in testing. Updates the app state with a partial hash. */
    public mockState(partialState: MockAppState): void {
        this.store.setStateForTesting(partialState as any);
    }

    /**
     * Only available in testing. Track all select() calls.
     * Returns an array that contains the selector of every `select()` call
     * which has been subscribed to. Unsubscribing removes the selector from the array.
     */
    public trackSubscriptions(): Array<(state: AppState) => any> {
        this.trackedSubscriptions = [];
        const subscriptionList = this.trackedSubscriptions;

        const originalSelect = super.select;
        this.select = jasmine.createSpy('select').and.callFake(
            (selector: any): Observable<any> => {
                const observable = super.select(selector);
                const originalSubscribe = observable.subscribe;
                const self = this;
                observable.subscribe = jasmine
                    .createSpy('subscribe')
                    .and.callFake(function fakeSubscribe(...args: any[]): any {
                        subscriptionList.push(selector);

                        const subscription: Subscription = originalSubscribe.call(this, ...args);
                        const originalUnsubscribe = subscription.unsubscribe;
                        let unsubscribed = false;

                        subscription.unsubscribe = jasmine
                            .createSpy('unsubscribe')
                            .and.callFake(function fakeUnsubscribe(): void {
                                const index = subscriptionList.indexOf(selector);
                                if (!unsubscribed && index >= 0) {
                                    subscriptionList.splice(index, 1);
                                    unsubscribed = true;
                                }
                                return originalUnsubscribe.call(this);
                            });

                        return subscription;
                    });
                return observable;
            }
        );

        return subscriptionList;
    }

    /**
     * Only available in testing.
     * When trackSubscriptions() is used, returns the state branches that `select()` calls map to.
     * @example
     *     appState.trackSubscriptions();
     *     const stream = appState.select(state => state.editor && state.folder);
     *     appState.getSubscribedBranches(); // => []
     *     const sub = stream.subscribe();
     *     appState.getSubscribedBranches(); // => ['editor', 'folder']
     *     sub.unsubscribe();
     *     appState.getSubscribedBranches(); // => []
     */
    public getSubscribedBranches(selectors?: Array<(state: AppState) => any>): Array<keyof AppState> {
        selectors = selectors || this.trackedSubscriptions;

        const usedBranches: any = {};
        for (const selectorFunction of selectors) {
            // Get name of first function argument from function body
            const source: string = Function.prototype.toString.call(selectorFunction);
            const parsed = source.match(/^function\s*[\(]*\(\s*([^,\)\s]+)[^\)]*\)\s*\{(.+)\}$/);
            if (!parsed) {
                continue;
            }
            const [, firstParam, functionBody] = parsed;
            // Search for "state.something" in the function body
            const regex = new RegExp(`(?:^|[^.\[])${firstParam}\.([a-zA-Z0-9_$]+)`, 'g');
            const matches = functionBody.match(regex) || [];
            for (const match of matches) {
                const accessedProperty = match.split('.')[1];
                usedBranches[accessedProperty] = true;
            }
        }

        return Object.keys(usedBranches).sort() as Array<keyof AppState>;
    }

    /**
     * Only available in testing. Mocks all action methods and tracks their calls.
     * @param behavior A strategy to use for the spy actions.
     * - "original": Spies on method calls, but passes calls through to the original actions.
     * - "stub": Spies on method calls, but does nothing
     * - "throw": Throw on method calls, unless they are explicitly set to a different value.
     */
    public trackAllActionCalls({ behavior }: { behavior: 'original' | 'stub' | 'throw' } = { behavior: 'stub' }): void {
        for (const branchName of Object.keys(this.actions)) {
            const actionBranch = (this.actions as any)[branchName];
            const prototype = Object.getPrototypeOf(actionBranch);
            const propNames = Object.keys(prototype);

            for (const key of propNames) {
                if (typeof actionBranch[key] === 'function' && actionBranch[key] === prototype[key]) {
                    const originalMethod = actionBranch[key];
                    const self = this;
                    const method = branchName + '.' + key;

                    // Overwrite the original action method with a jasmine spy and a custom function
                    actionBranch[key] = jasmine
                        .createSpy(method)
                        .and.callFake(function(this: any, ...args: any[]): any {
                            self.trackedActionCalls = self.trackedActionCalls.concat({ method, args });

                            switch (behavior) {
                                case 'original':
                                    return originalMethod.call(this, ...args);
                                case 'stub':
                                    return undefined;
                                case 'throw':
                                    throw new Error('TestApplicationState: ' + method + ' called, but not mocked');
                                default:
                                    return undefined;
                            }
                        });
                }
            }
        }
    }
}

type ThreeLevelsPartial<T> = { [K in keyof T]?: TwoLevelsPartial<T[K]> };
type TwoLevelsPartial<T> = { [K in keyof T]?: Partial<T[K]> };
