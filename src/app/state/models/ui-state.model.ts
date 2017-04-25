import { UILanguage } from '../../shared/providers/i18n/i18n.service';
import { Project } from '../../common/models/project.model';

export interface UIState {
    currentLanguage: UILanguage;
    currentProject: string;
}
