import { Component, OnInit } from '@angular/core';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss']
})

export class ContainerContentsComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private router: Router,
                private state: ApplicationStateService,
                private editorEffects: EditorEffectsService) {
    }

    ngOnInit(): void {
        const onLogin$ = this.state.select(state => state.auth.loggedIn)
            .distinctUntilChanged()
            .filter(loggedIn =>  loggedIn === true);

        onLogin$
            .switchMapTo(this.route.paramMap)
            .subscribe(paramMap => {
                const projectName = paramMap.get('projectName');
                const containerUuid = paramMap.get('containerUuid');
                if (projectName && containerUuid) {
                    // open this container in list view
                }
            });
    }

    openNode(): void {
        this.router.navigate(['/editor', 'project', { outlets: {
            detail: ['demo', 'node_uuid']
        }}]);
    }
}
