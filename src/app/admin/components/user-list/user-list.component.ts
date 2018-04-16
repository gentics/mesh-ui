import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../common/models/user.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'mesh-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    users$: Observable<User[]>;
    currentPage$: Observable<number>;
    itemsPerPage$: Observable<number>;
    totalItems$: Observable<number>;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private route: ActivatedRoute,
                private router: Router,
                private adminUserEffects: AdminUserEffectsService) { }

    ngOnInit() {
        this.route.queryParamMap
            .subscribe(paramMap => {
                const page = paramMap.get('p') || 1;
                const perPage = paramMap.get('perPage') || 25;
                this.adminUserEffects.loadUsers(+page, +perPage);
            });

        this.users$ = this.state.select(state => state.adminUsers.userList)
            .map(uuids => uuids.map(uuid => this.entities.getUser(uuid)));

        this.currentPage$ = this.state.select(state => state.adminUsers.pagination.currentPage);
        this.itemsPerPage$ = this.state.select(state => state.adminUsers.pagination.itemsPerPage);
        this.totalItems$ = this.state.select(state => state.adminUsers.pagination.totalItems);
    }

    onPageChange(newPage: number): void {
        this.router.navigate(['/admin/users'], { queryParams: { p: newPage } });
    }

}
