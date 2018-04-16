import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../common/models/user.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'mesh-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

    form: FormGroup;

    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) { }

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

}
