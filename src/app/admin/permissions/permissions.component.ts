import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AdminRoleResponse } from '../providers/effects/admin-role-effects.service';

@Component({
    selector: 'mesh-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent implements OnInit {
    role: AdminRoleResponse;

    constructor(private route: ActivatedRoute, private change: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.role = data.role;
            this.change.markForCheck();
        });
    }
}
