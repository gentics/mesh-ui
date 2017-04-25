import { Component, OnInit } from '@angular/core';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';

@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss']
})

export class ContainerContentsComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private navigationService: NavigationService,
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
        this.navigationService.detail('demo', 'node_uuid').navigate();
    }
}
