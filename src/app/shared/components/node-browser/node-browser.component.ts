import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IBreadcrumbLink, IModalDialog } from 'gentics-ui-core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, flatMap, map, share } from 'rxjs/operators';

import { notNullOrUndefined } from '../../../common/util/util';
import { ApiService } from '../../../core/providers/api/api.service';

import { NodeBrowserOptions, PageResult, QueryResult } from './interfaces';

const query = `
query($parent: String, $filter: NodeFilter, $perPage: Int, $page: Long) {
	node(uuid: $parent) {
		children(filter: $filter, perPage: $perPage, page: $page) {
            totalCount
            pageCount
			elements {
				uuid
				displayName
				isContainer
			}
		}
		breadcrumb {
			uuid
			text: displayName
		}
	}
}`;

/**
 * A browser that allows selecting nodes.
 *
 * It can be used for single or multiple selection
 * and limit the type of the allowed selection.
 *
 */
@Component({
    selector: 'mesh-node-browser',
    templateUrl: './node-browser.tpl.html',
    styleUrls: ['./node-browser.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeBrowserComponent implements IModalDialog, OnInit {
    constructor(private apiService: ApiService) {}

    @Input() options: NodeBrowserOptions;

    currentNode: Subject<string>;
    queryResult$: Observable<QueryResult>;
    currentPageContent$: Observable<any[]>;
    breadcrumb$: Observable<IBreadcrumbLink[]>;
    totalItems$: Observable<number>;
    pageCount$: Observable<number>;
    currentPage$ = new BehaviorSubject(1);

    closeFn(val: any): void {}
    cancelFn(val: any): void {}

    selected: PageResult[] = [];

    readonly perPage = 10;

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    ngOnInit(): void {
        this.currentNode = new BehaviorSubject(this.options.startNodeUuid);

        this.queryResult$ = Observable.combineLatest(this.currentNode, this.currentPage$).pipe(
            flatMap(([parent, page]) =>
                this.apiService.graphQL(
                    { project: this.options.projectName },
                    {
                        query,
                        variables: { query, parent, perPage: this.perPage, page }
                    }
                )
            ),
            map(response => response.data),
            filter(notNullOrUndefined),
            share()
        ) as Observable<QueryResult>;

        this.currentPageContent$ = this.queryResult$.map(result => result.node.children.elements);
        this.breadcrumb$ = this.queryResult$.map(result => this.toBreadcrumb(result));
        this.totalItems$ = this.queryResult$.map(result => result.node.children.totalCount);
        this.pageCount$ = this.queryResult$.map(result => result.node.children.pageCount);
    }

    toBreadcrumb(result: QueryResult): IBreadcrumbLink[] {
        const breadcrumbs = result.node.breadcrumb;

        return breadcrumbs.map((crumb, index) => {
            if (index === 0) {
                crumb.text = this.options.projectName;
            }
            if (!crumb.text) {
                crumb.text = crumb.uuid;
            }
            return crumb;
        });
    }

    submitClicked() {
        this.closeFn(this.selected.map(item => item.uuid));
    }
}
