import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { UserCreateRequest, UserUpdateRequest } from '../../../common/models/server-models';
import { User, UserNodeReference } from '../../../common/models/user.model';
import { notNullOrUndefined } from '../../../common/util/util';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { FormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';

@Component({
    selector: 'mesh-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrls: ['./group-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isNew = false;
    readOnly = true;
    userNode$: Observable<MeshNode>;
    userNodeSchema$: Observable<Schema>;
    userNodeLink$: Observable<any[]>;
    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

    @ViewChild('formGenerator') private formGenerator: FormGeneratorComponent;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private navigationService: NavigationService,
        private entities: EntitiesService,
        private adminUserEffects: AdminUserEffectsService
    ) {}

    ngOnInit() {
        const user$: Observable<User> = this.route.data.map(data => data.user).filter(notNullOrUndefined);
        const nodeReference$ = user$.map(user => user.nodeReference).filter(notNullOrUndefined);

        this.userNode$ = nodeReference$
            .map(nodeReference => this.entities.getNode(nodeReference.uuid, { strictLanguageMatch: false }))
            .filter(notNullOrUndefined);

        this.userNodeSchema$ = nodeReference$
            .map(nodeReference => this.entities.getSchema(nodeReference.schema.uuid || ''))
            .filter(notNullOrUndefined);

        this.userNodeLink$ = this.userNode$.map(node => {
            if (node.language && node.project && node.project.name) {
                return this.navigationService
                    .instruction({
                        detail: {
                            projectName: node.project.name,
                            nodeUuid: node.uuid,
                            language: node.language
                        },
                        list: {
                            containerUuid: node.parentNode.uuid,
                            projectName: node.project.name,
                            language: node.language
                        }
                    })
                    .commands();
            } else {
                return [];
            }
        });

        user$.takeUntil(this.destroy$).subscribe(user => {
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

    selectNodeReference(): void {
        alert('Requires Repository Browser!');
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
        if (this.form.dirty) {
            const uuid = this.route.snapshot.paramMap.get('uuid');
            if (uuid) {
                const updateRequest = this.getUserFromForm();
                this.adminUserEffects.updateUser(uuid, updateRequest).then(user => {
                    if (user) {
                        this.form.markAsPristine();
                    }
                });
            }
        }
    }

    private createUser(): void {
        const updateRequest = this.getUserFromForm() as UserCreateRequest;
        this.adminUserEffects.createUser(updateRequest).then(user => {
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
