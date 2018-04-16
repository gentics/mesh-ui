import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../common/models/user.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { UserUpdateRequest } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

    form: FormGroup;

    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private adminUserEffects: AdminUserEffectsService) { }

    ngOnInit() {
        this.route.data
            .takeUntil(this.destroy$)
            .subscribe(data => {
                const user: User | undefined = data.user;

                this.form = this.formBuilder.group({
                    userName: user ? user.username : '',
                    firstName: user ? user.firstname : '',
                    lastName: user ? user.lastname : '',
                    emailAddress: user ? user.emailAddress : ''
                });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateUser(): void {
        const uuid = this.route.snapshot.paramMap.get('uuid');
        const formValue = this.form.value;
        const userUpdateRequest: UserUpdateRequest = {
            username: formValue.userName,
            firstname: formValue.firstName,
            lastname: formValue.lastName,
            emailAddress: formValue.emailAddress
        };
        this.adminUserEffects.updateUser(uuid, userUpdateRequest)
            .then(user => {
                if (user) {
                    this.form.markAsPristine();
                }
            });
    }

}
