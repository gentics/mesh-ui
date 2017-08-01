import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';

@Component({
    selector: 'node-language-switcher',
    templateUrl: 'node-language-switcher.component.html',
    styleUrls: ['node-language-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeLanguageSwitcherComponent {
    @Input() node: MeshNode | undefined;

    get availableLanguages(): Array<{ code: string; translationExists: boolean; }> {
        return this.config.CONTENT_LANGUAGES
            .filter(lang => {
                if (!this.node) {
                    return false;
                }
                return lang !== this.node.language;
            })
            .map(lang => {
                return {
                    code: lang,
                    translationExists: -1 < this.node!.availableLanguages.indexOf(lang)
                };
            });
    }

    constructor(private config: ConfigService,
                private navigationService: NavigationService) {}

    itemClick(language: { code: string; translationExists: boolean; }): void {
        if (this.node) {
            if (language.translationExists) {
                this.navigationService.detail(this.node.project.name!, this.node.uuid, language.code).navigate();
            } else {
                // create translation
            }
        }
    }
}
