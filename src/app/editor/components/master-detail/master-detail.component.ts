import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';

@Component({
    selector: 'master-detail',
    templateUrl: './master-detail.component.html',
    styleUrls: ['./master-detail.scss']
})
export class MasterDetailComponent implements OnInit {

    editorFocused$: Observable<boolean>;
    editorOpen$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private navigationService: NavigationService) {
        this.editorFocused$ = state.select(state => state.editor.editorIsFocused);
        this.editorOpen$ = state.select(state => state.editor.editorIsOpen);
    }

    ngOnInit(): void {
        // TODO: We need to determine a "default" project to load up on init, fetch it from the
        // API and navigate to its baseNode.
        this.navigationService.list('demo', 'container_uuid').navigate();
    }

    setSplitFocus(focus: 'left' | 'right'): void {
        if (focus === 'right') {
            this.state.actions.editor.focusEditor();
        } else {
            this.state.actions.editor.focusList();
        }
    }

}
