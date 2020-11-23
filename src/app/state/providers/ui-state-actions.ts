import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { ConfigService } from '../../core/providers/config/config.service';
import { UILanguage } from '../../core/providers/i18n/i18n.service';
import { AppState } from '../models/app-state.model';
import { UIState } from '../models/ui-state.model';

@Injectable()
@Immutable()
export class UIStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private ui: UIState;

    constructor(config: ConfigService) {
        super({
            uses: ['ui'],
            initialState: {
                ui: {
                    currentLanguage: config.DEFAULT_CONTENT_LANGUAGE as UILanguage,
                    searchAvailable: false
                }
            }
        });
    }

    setLanguage(newUiLanguage: UILanguage): void {
        this.ui.currentLanguage = newUiLanguage;
    }

    setSearchAvailable(searchAvailable: boolean): void {
        this.ui.searchAvailable = searchAvailable;
    }
}
