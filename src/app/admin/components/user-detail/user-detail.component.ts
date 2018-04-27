import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { User } from '../../../common/models/user.model';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { UserCreateRequest, UserUpdateRequest } from '../../../common/models/server-models';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { FormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component';

@Component({
    selector: 'mesh-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit, OnDestroy {

    form: FormGroup;
    isNew = false;
    readOnly = true;
    userNode$: Observable<MeshNode>;
    userNodeSchema$: Observable<Schema>;

    @ViewChild('formGenerator')
    private formGenerator: FormGeneratorComponent;
    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private formBuilder: FormBuilder,
                private entities: EntitiesService,
                private adminUserEffects: AdminUserEffectsService) { }

    ngOnInit() {
        const user$: Observable<User | undefined> = this.route.data.map(data => data.user);

        this.userNode$ = user$
            .filter(user => user && !!user.nodeReference)
            .map(user => this.entities.getNode(user.nodeReference.uuid, { strictLanguageMatch: false }));

         this.userNodeSchema$ = user$
            .filter(user => user && !!user.nodeReference)
            .map(user => this.entities.getSchema(user.nodeReference.schema.uuid));

        user$.takeUntil(this.destroy$)
            .subscribe(user => {
                this.isNew = !user;
                this.readOnly = !!user && !user.permissions.update;
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

    isSaveButtonEnabled(): boolean {
        const basicFormIsSavable = this.form.dirty && this.form.valid && !this.readOnly;
        if (this.formGenerator) {
            const formGeneratorIsSavable = this.formGenerator.isDirty && this.formGenerator.isValid;
            return (basicFormIsSavable && this.formGenerator.isValid) || formGeneratorIsSavable;
        } else {
            return basicFormIsSavable;
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
