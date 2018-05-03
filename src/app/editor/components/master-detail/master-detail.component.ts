import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { Project } from '../../../common/models/project.model';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';


@Component({
    selector: 'master-detail',
    templateUrl: './master-detail.component.html',
    styleUrls: ['./master-detail.scss']
})
export class MasterDetailComponent implements OnInit {

    editorFocused$: Observable<boolean>;
    editorOpen$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private listEffects: ListEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.editorFocused$ = this.state.select(state => state.editor.editorIsFocused);
        this.editorOpen$ = this.state.select(state => state.editor.editorIsOpen);

        this.listEffects.loadProjects();

        // TODO: We need to determine a "default" project to load up on init, fetch it from the
        // API and navigate to its baseNode.
        // this.navigationService.list('demo', 'container_uuid').navigate();
        this.state.select(state => state.auth.loggedIn)
            .filter(Boolean)
            .switchMap(() => this.state.select(state => {
                const projects = state.entities.project;
                const firstProjectUuid = Object.keys(projects)[0];
                return firstProjectUuid && projects[firstProjectUuid];
            }))
            .filter(Boolean)
            .take(1)
            .subscribe((firstProject: Project) => {
                // If the list params are already set in the URL, use those. Otherwise
                // default to the first project.
                const listRoute = this.route.snapshot.children.find(route => route.outlet === 'list');
                const projectName = listRoute ? listRoute.paramMap.get('projectName') : firstProject.name;
                const containerUuid = listRoute ? listRoute.paramMap.get('containerUuid') : firstProject.rootNode.uuid;
                const language = listRoute ? listRoute.paramMap.get('language') : undefined;

                if (projectName && containerUuid) {
                    this.navigationService.list(projectName, containerUuid, language || undefined)
                        .navigate({queryParams: this.route.snapshot.queryParams});
                }
            });
    }

    setSplitFocus(focus: 'left' | 'right'): void {
        if (focus === 'right') {
            this.state.actions.editor.focusEditor();
        } else {
            this.state.actions.editor.focusList();
        }
    }

}
