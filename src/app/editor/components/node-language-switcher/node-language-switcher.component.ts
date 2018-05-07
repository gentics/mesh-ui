import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';

@Component({
    selector: 'node-language-switcher',
    templateUrl: 'node-language-switcher.component.html',
    styleUrls: ['node-language-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeLanguageSwitcherComponent {
    @Input() node: MeshNode | undefined;

    constructor(private config: ConfigService,
                private editorEffects: EditorEffectsService,
                private navigationService: NavigationService) {}

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
                    translationExists: !!this.node!.availableLanguages ? !!this.node!.availableLanguages[lang] : false
                };
            });
    }

    itemClick(language: { code: string; translationExists: boolean; }): void {
        if (this.node) {
            if (language.translationExists) {
                this.navigateToLanguage(language.code);
            } else {
                this.editorEffects.createTranslation(this.node, language.code)
                    .then(() => {
                        this.navigateToLanguage(language.code);
                    });
            }
        }
    }

    private navigateToLanguage(languageCode: string): void {
        if (this.node) {
            this.navigationService.detail(this.node.project.name!, this.node.uuid, languageCode).navigate();
        }
    }
}
