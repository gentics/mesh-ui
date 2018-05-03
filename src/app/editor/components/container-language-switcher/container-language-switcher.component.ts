import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { EntitiesService } from '../../../state/providers/entities.service';
import { concatUnique, notNullOrUndefined } from '../../../common/util/util';

@Component({
    selector: 'mesh-container-language-switcher',
    templateUrl: 'container-language-switcher.component.html',
    styleUrls: ['container-language-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContainerLanguageSwitcherComponent {

    currentLanguage$: Observable<string>;
    availableLanguages$: Observable<string[]>;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private navigationService: NavigationService) {

        this.currentLanguage$ = this.state.select(state => state.list.language);

        this.availableLanguages$ = this.state.select(state => state.list.items)
            .filter(notNullOrUndefined)
            .combineLatest(this.currentLanguage$)
            .map(([childrenUuids, language]) => this.uuidsToUniqueLanguages(childrenUuids, language))
            .combineLatest(this.currentLanguage$)
            .map(([languages, currentLanguage]) => this.removeCurrentLanguage(languages, currentLanguage));
    }

    /**
     * Given an array of node uuids, this concatenates all unique langauges in which
     * those nodes are available.
     */
    private uuidsToUniqueLanguages(uuids: string[], language: string): string[] {
        return uuids
            .map(uuid => this.entities.getNode(uuid, { language, strictLanguageMatch: false }))
            .filter<MeshNode>(notNullOrUndefined)
            .map(node => node.availableLanguages)
            .reduce((unique, curr) => concatUnique(unique, Object.keys(curr)), []);
    }

    private removeCurrentLanguage(languages: string[], currentLanguage: string): string[] {
        const index = languages.indexOf(currentLanguage);
        if (-1 < index) {
            languages.splice(index, 1);
        }
        return languages;
    }

    itemClick(languageCode: string): void {
        const listState = this.state.now.list;
        this.navigationService.list(listState.currentProject!, listState.currentNode!, languageCode).navigate();
    }
}
