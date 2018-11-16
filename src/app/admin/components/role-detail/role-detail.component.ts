import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { RoleCreateRequest, RoleUpdateRequest } from '../../../common/models/server-models';
import { FormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component';
import { AdminRoleEffectsService, AdminRoleOnlyResponse } from '../../providers/effects/admin-role-effects.service';

@Component({
    selector: 'mesh-role-detail',
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleDetailComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isNew = false;
    role: AdminRoleOnlyResponse;
    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;
    readOnly = true;

    @ViewChild('formGenerator') private formGenerator: FormGeneratorComponent;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private adminRoleEffects: AdminRoleEffectsService
    ) {}

    ngOnInit() {
        this.route.data
            .do((role: any) => console.log('!!! role:', role))
            .map(data => data.role)
            .takeUntil(this.destroy$)
            .subscribe((role: AdminRoleOnlyResponse) => {
                this.isNew = !role;
                this.role = role;
                // TODO Fetch from GraphQL as soon as permissions bug in Mesh is fixed
                // TODO Fetch information about create permissions for user as soon as this is possible in Mesh
                this.readOnly = false;
                this.form = this.formBuilder.group({
                    roleName: [role ? role.name : '', Validators.required]
                });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

    persistRole(): void {
        if (this.isNew) {
            this.createRole();
        } else {
            this.updateRole();
        }
    }

    private updateRole(): void {
        if (this.form.dirty) {
            const uuid = this.route.snapshot.paramMap.get('uuid');
            if (uuid) {
                const updateRequest = this.getRoleRequest();
                this.adminRoleEffects.updateRole(uuid, updateRequest).subscribe(role => {
                    this.router.navigate(['/admin/roles']);
                });
            }
        }
    }

    private createRole(): void {
        const createRequest = this.getRoleRequest();
        this.adminRoleEffects.createRole(createRequest).subscribe(role => {
            if (role) {
                this.router.navigate(['/admin/roles']);
            }
        });
    }

    private getRoleRequest(): RoleUpdateRequest | RoleCreateRequest {
        const formValue = this.form.value;
        return {
            name: formValue.roleName
        };
    }
}
