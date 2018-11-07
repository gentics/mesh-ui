import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { GroupCreateRequest, GroupUpdateRequest } from '../../../common/models/server-models';
import { FormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component';
import { AdminGroupEffectsService, AdminGroupOnlyResponse } from '../../providers/effects/admin-group-effects.service';

@Component({
    selector: 'mesh-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrls: ['./group-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isNew = false;
    group: AdminGroupOnlyResponse;
    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;
    readOnly = true;

    @ViewChild('formGenerator') private formGenerator: FormGeneratorComponent;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private adminGroupEffects: AdminGroupEffectsService
    ) {}

    ngOnInit() {
        this.route.data
            .map(data => data.group)
            .takeUntil(this.destroy$)
            .subscribe((group: AdminGroupOnlyResponse) => {
                this.isNew = !group;
                this.group = group;
                // TODO Fetch from GraphQL as soon as permissions bug in Mesh is fixed
                // TODO Fetch information about create permissions for user as soon as this is possible in Mesh
                this.readOnly = false;
                this.form = this.formBuilder.group({
                    groupName: [group ? group.name : '', Validators.required]
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

    persistGroup(): void {
        if (this.isNew) {
            this.createGroup();
        } else {
            this.updateGroup();
        }
    }

    private updateGroup(): void {
        if (this.form.dirty) {
            const uuid = this.route.snapshot.paramMap.get('uuid');
            if (uuid) {
                const updateRequest = this.getGroupFromForm();
                this.adminGroupEffects.updateGroup(uuid, updateRequest).subscribe(group => {
                    this.router.navigate(['/admin/groups']);
                });
            }
        }
    }

    private createGroup(): void {
        const createRequest = this.getGroupFromForm() as GroupCreateRequest;
        this.adminGroupEffects.createGroup(createRequest).subscribe(group => {
            if (group) {
                this.router.navigate(['/admin/groups']);
            }
        });
    }

    private getGroupFromForm(): GroupUpdateRequest | GroupCreateRequest {
        const formValue = this.form.value;
        return {
            name: formValue.groupName
        };
    }
}
