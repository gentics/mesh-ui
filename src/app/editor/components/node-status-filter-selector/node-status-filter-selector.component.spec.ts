import { Component, DebugElement } from '@angular/core';
import { tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownTriggerDirective, GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';
import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';
import { componentTest } from 'src/testing/component-test';
import { configureComponentTest } from 'src/testing/configure-component-test';

import { IsAllNodeStatusesPipe, NodeStatusFilterSelectorComponent } from './node-status-filter-selector.component';

describe('NodeStatusFilterSelectorComponent:', () => {
    const nodeStatuses: EMeshNodeStatusStrings[] = Object.values(EMeshNodeStatusStrings);

    beforeEach(() => {
        configureComponentTest({
            declarations: [TestComponent, NodeStatusFilterSelectorComponent, IsAllNodeStatusesPipe],
            providers: [OverlayHostService],
            imports: [GenticsUICoreModule.forRoot()]
        });
    });

    describe('Provides an option for', () => {
        it(
            'every status provided',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.componentInstance.nodeStatuses = nodeStatuses;
                    fixture.detectChanges();
                    const nodeStatusFilterSelectorComponent: DebugElement = fixture.debugElement.query(
                        By.directive(NodeStatusFilterSelectorComponent)
                    );
                    const dropdownTrigger: HTMLElement = nodeStatusFilterSelectorComponent.query(
                        By.directive(DropdownTriggerDirective)
                    ).nativeElement;
                    dropdownTrigger.click();
                    fixture.detectChanges();
                    tick();
                    nodeStatuses.forEach(nodeStatus => {
                        const dropdownItem: DebugElement[] = fixture.debugElement.queryAll(
                            By.css(`gtx-dropdown-content gtx-dropdown-item > div.status.${nodeStatus}`)
                        );
                        expect(dropdownItem.length).toEqual(1);
                    });
                }
            )
        );

        it(
            'all',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.componentInstance.nodeStatuses = nodeStatuses;
                    fixture.detectChanges();
                    const nodeStatusFilterSelectorComponent: DebugElement = fixture.debugElement.query(
                        By.directive(NodeStatusFilterSelectorComponent)
                    );
                    const dropdownTrigger: HTMLElement = nodeStatusFilterSelectorComponent.query(
                        By.directive(DropdownTriggerDirective)
                    ).nativeElement;
                    dropdownTrigger.click();
                    fixture.detectChanges();
                    tick();
                    const dropdownItem: DebugElement[] = fixture.debugElement.queryAll(
                        By.css(`gtx-dropdown-content gtx-dropdown-item > div.status.all`)
                    );
                    expect(dropdownItem.length).toEqual(1);
                }
            )
        );
    });

    describe('Shows a node status badge for', () => {
        for (let i = 0; i < nodeStatuses.length - 1; i++) {
            it(
                `${nodeStatuses[i]} and ${nodeStatuses[i + 1]} node statuses, if only ${nodeStatuses[i]} and ${
                    nodeStatuses[i + 1]
                } are selected`,
                componentTest(
                    () => TestComponent,
                    fixture => {
                        fixture.componentInstance.nodeStatuses = nodeStatuses;
                        fixture.componentInstance.searchNodeStatusFilter = [nodeStatuses[i], nodeStatuses[i + 1]];
                        fixture.detectChanges();
                        [nodeStatuses[i], nodeStatuses[i + 1]].forEach(nodeStatus => {
                            const selectedState: DebugElement[] = fixture.debugElement.queryAll(
                                By.css(`gtx-dropdown-trigger > div.trigger > div.status.${nodeStatus}`)
                            );
                            expect(selectedState.length).toEqual(1);
                        });
                    }
                )
            );
        }

        it(
            'all (and nothing else), if all are selected',
            componentTest(
                () => TestComponent,
                fixture => {
                    fixture.componentInstance.nodeStatuses = nodeStatuses;
                    fixture.componentInstance.searchNodeStatusFilter = nodeStatuses;
                    fixture.detectChanges();
                    const selectedAllStates: DebugElement[] = fixture.debugElement.queryAll(
                        By.css(`gtx-dropdown-trigger > div.trigger > div.status.all`)
                    );
                    expect(selectedAllStates.length).toEqual(1);
                    const selectedStates: DebugElement[] = fixture.debugElement.queryAll(
                        By.css(`gtx-dropdown-trigger > div.trigger`)
                    );
                    expect(selectedStates.length).toEqual(1);
                }
            )
        );
    });

    describe('Emits a new filter for', () => {
        for (const nodeStatus of nodeStatuses) {
            it(
                `the "${nodeStatus}" node state if clicked on "${nodeStatus}"`,
                componentTest(
                    () => TestComponent,
                    fixture => {
                        let selectedFilter: EMeshNodeStatusStrings[] = [];
                        fixture.componentInstance.nodeStatuses = nodeStatuses;
                        fixture.componentInstance.onNodeStatusFilterSelected = (value: EMeshNodeStatusStrings[]) => {
                            selectedFilter = value;
                        };
                        fixture.detectChanges();
                        const nodeStatusFilterSelectorComponent: DebugElement = fixture.debugElement.query(
                            By.directive(NodeStatusFilterSelectorComponent)
                        );
                        const dropdownTrigger: HTMLElement = nodeStatusFilterSelectorComponent.query(
                            By.directive(DropdownTriggerDirective)
                        ).nativeElement;
                        dropdownTrigger.click();
                        fixture.detectChanges();
                        tick();
                        const dropdownItem: HTMLElement = fixture.debugElement.query(
                            By.css(`gtx-dropdown-content gtx-dropdown-item > div.status.${nodeStatus}`)
                        ).nativeElement;
                        dropdownItem.click();
                        fixture.detectChanges();
                        tick();
                        expect(selectedFilter.length).toEqual(1);
                        if (selectedFilter.length > 0) {
                            expect(selectedFilter[0]).toEqual(nodeStatus);
                        }
                    }
                )
            );
        }

        it(
            'all node states if clicked on "all"',
            componentTest(
                () => TestComponent,
                fixture => {
                    let selectedFilter: EMeshNodeStatusStrings[] = [];
                    fixture.componentInstance.nodeStatuses = nodeStatuses;
                    fixture.componentInstance.onNodeStatusFilterSelected = (value: EMeshNodeStatusStrings[]) => {
                        selectedFilter = value;
                    };
                    fixture.detectChanges();
                    const nodeStatusFilterSelectorComponent: DebugElement = fixture.debugElement.query(
                        By.directive(NodeStatusFilterSelectorComponent)
                    );
                    const dropdownTrigger: HTMLElement = nodeStatusFilterSelectorComponent.query(
                        By.directive(DropdownTriggerDirective)
                    ).nativeElement;
                    dropdownTrigger.click();
                    fixture.detectChanges();
                    tick();
                    const dropdownItem: HTMLElement = fixture.debugElement.query(
                        By.css(`gtx-dropdown-content gtx-dropdown-item > div.status.all`)
                    ).nativeElement;
                    dropdownItem.click();
                    fixture.detectChanges();
                    tick();
                    expect(selectedFilter).toEqual(nodeStatuses);
                }
            )
        );
    });
});

@Component({
    template: `
        <mesh-node-status-filter-selector
            [nodeStatuses]="nodeStatuses"
            [selectedNodeStatusFilter]="searchNodeStatusFilter"
            (selectedNodeStatusFilterChange)="onNodeStatusFilterSelected($event)"
        ></mesh-node-status-filter-selector>
        <gtx-overlay-host></gtx-overlay-host>
    `
})
class TestComponent {
    nodeStatuses: EMeshNodeStatusStrings[] = [];
    searchNodeStatusFilter: EMeshNodeStatusStrings[] = [];
    onNodeStatusFilterSelected: (selectedNodeStatusFilter: EMeshNodeStatusStrings[]) => void = () => {};
}
