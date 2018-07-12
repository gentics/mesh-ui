import { Injectable } from '@angular/core';

import { ApiBase } from './api-base.service';

@Injectable()
export class SearchApi {
    constructor(private apiBase: ApiBase) {}

    getStatus() {
        return this.apiBase.get('/search/status', {});
    }
}
