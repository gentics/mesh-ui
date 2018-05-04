import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { UserCreateRequest } from '../../../common/models/server-models';
import { AdminUserEffectsService } from '../effects/admin-user-effects.service';

import { firstNames, lastNames } from './mock-data';

/**
 * This service should only be used at development time. It exposes methods for quickly creating mock data in bulk
 * in the Mesh backend.
 */
@Injectable()
export class MockDataService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private adminUserEffects: AdminUserEffectsService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Create some mock users. The maximum count is ~100.
     */
    createMockUsers(count: number = 10): void {
        if (firstNames.length < count) {
            console.warn(`Maximum of mock user count of ${firstNames.length} was exceeded.`);
            return;
        }

        const userCreateRequests = firstNames.reduce(
            (requests, firstName) => {
                const lastName = randomElement(lastNames);
                const userName = `${firstName}${lastName}`.toLowerCase();
                const email = `${firstName}.${lastName}@test.com`.toLowerCase();
                return requests.concat({
                    firstname: firstName,
                    lastname: lastName,
                    username: userName,
                    emailAddress: email,
                    password: 'test'
                });
            },
            [] as UserCreateRequest[]
        );

        Observable.from(userCreateRequests)
            .takeUntil(this.destroy$)
            .concatMap(request => this.adminUserEffects.createUser(request))
            .subscribe(result => {
                console.log(`Created a new mock user:`, result);
            });
    }
}

/**
 * Returns a random element of an array
 */
function randomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}
