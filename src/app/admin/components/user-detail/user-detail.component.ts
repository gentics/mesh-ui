import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { User } from '../../../common/models/user.model';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { UserCreateRequest, UserUpdateRequest } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

    form: FormGroup;
    isNew = false;
    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private formBuilder: FormBuilder,
                private adminUserEffects: AdminUserEffectsService) { }

    ngOnInit() {
        this.route.data
            .takeUntil(this.destroy$)
            .subscribe(data => {
                const user: User | undefined = data.user;
                this.isNew = !user;
                this.form = this.formBuilder.group({
                    userName: [user ? user.username : '', Validators.required],
                    password: ['', user ? undefined : Validators.required],
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

    persistUser(): void {
        if (this.isNew) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private updateUser(): void {
        const uuid = this.route.snapshot.paramMap.get('uuid');
        const updateRequest = this.getUserFromForm();
        this.adminUserEffects.updateUser(uuid, updateRequest)
            .then(user => {
                if (user) {
                    this.form.markAsPristine();
                }
            });
    }

    private createUser(): void {
        const updateRequest = this.getUserFromForm() as UserCreateRequest;
        this.adminUserEffects.createUser(updateRequest)
            .then(user => {
                if (user) {
                    this.router.navigate(['/admin/users', user.uuid]);
                }
            });
    }

    private getUserFromForm(): UserUpdateRequest | UserCreateRequest {
        const formValue = this.form.value;
        return {
            username: formValue.userName,
            password: formValue.password,
            firstname: formValue.firstName,
            lastname: formValue.lastName,
            emailAddress: formValue.emailAddress
        };
    }
}
