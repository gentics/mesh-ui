import { Injectable } from '@angular/core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ApiService } from '../api/api.service';

@Injectable()
export class SearchEffectsService {
    constructor(private api: ApiService, private state: ApplicationStateService) {}

    checkSearchAvailability(): void {
        this.api.search.getStatus().subscribe(response => this.state.actions.ui.setSearchAvailable(response.available));
    }
}
