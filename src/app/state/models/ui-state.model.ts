import { UILanguage } from '../../core/providers/i18n/i18n.service';

export interface UIState {
    currentLanguage: UILanguage;
    searchAvailable: boolean;
}
