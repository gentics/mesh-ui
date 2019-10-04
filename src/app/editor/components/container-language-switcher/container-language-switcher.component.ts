import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeshNode } from '../../../common/models/node.model';
import { concatUnique, notNullOrUndefined } from '../../../common/util/util';
import { ConfigService } from '../../../core/providers/config/config.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    selector: 'mesh-container-language-switcher',
    templateUrl: 'container-language-switcher.component.html',
    styleUrls: ['container-language-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerLanguageSwitcherComponent {
    currentLanguage$: Observable<string>;
    availableLanguages$: Observable<string[]>;

    constructor(
        private state: ApplicationStateService,
        private config: ConfigService,
        private entities: EntitiesService,
        private navigationService: NavigationService
    ) {
        this.currentLanguage$ = this.state.select(state => state.list.language);

        this.availableLanguages$ = combineLatest([observableOf(config.CONTENT_LANGUAGES), this.currentLanguage$]).pipe(
            map(([languages, currentLanguage]) => {
                return this.removeCurrentLanguage(languages, currentLanguage);
            })
        );
    }

    private removeCurrentLanguage(languages: string[], currentLanguage: string): string[] {
        const index = languages.indexOf(currentLanguage);
        const languagesWithoutCurrentLanguage = [...languages];
        if (-1 < index) {
            languagesWithoutCurrentLanguage.splice(index, 1);
        }

        return languagesWithoutCurrentLanguage;
    }

    itemClick(languageCode: string): void {
        const listState = this.state.now.list;
        this.navigationService.list(listState.currentProject!, listState.currentNode!, languageCode).navigate();
    }
}
