import { Component, OnInit, ViewChild } from '@angular/core';
import { IModalDialog, InputField, DropdownList } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { fuzzyMatch, fuzzyReplace } from '../../../common/util/fuzzy-search';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterSelection } from '../../../common/models/common.model';

@Component({
    selector: 'app-create-tag-dialog',
    templateUrl: './create-tag-dialog.component.html',
    styleUrls: ['./create-tag-dialog.component.scss']
})
export class CreateTagDialogComponent implements IModalDialog, OnInit {

    @ViewChild('InputTagName') inputTagName: InputField;
    @ViewChild('InputTagFamily') inputTagFamily: InputField;
    @ViewChild('TagFamilyList') familyDropDown: DropdownList;

    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;

    newTagName: string;
    inputTagFamilyValue: string = '';

    filteredFamilies: FilterSelection[]= [];

    private tagFamilies: TagFamily[] = [];


    constructor(
        private i18n: I18nService,
        private state: ApplicationStateService,
        private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.state.select(state => state.entities.tagFamily)
        .map(families => Object.values(families).map(family => family))
        .subscribe((tagFamilies) => {
            this.tagFamilies = tagFamilies;
            this.filterFamilies();
        }).unsubscribe();
    }

    InTagNameInputChange(term: string): void {

    }

    onFamilyNameInputChange(term: string): void {
        this.filterFamilies();
    }

    onFamilySelected(tagFamily: TagFamily): void {
        this.inputTagFamily.writeValue(tagFamily.name);
    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    private filterFamilies() {
        if (this.inputTagFamilyValue.trim() === '') {
            this.filteredFamilies = this.tagFamilies.map(family => {
                return { value: family.name, valueFormated: family.name };
            });
        } else {
            this.filteredFamilies = this.tagFamilies.reduce<FilterSelection[]>((filteredFamilies, family) => {
                const matchedName = fuzzyReplace(this.inputTagFamilyValue, family.name);
                if (matchedName) {
                    filteredFamilies.push(matchedName);
                }
                return filteredFamilies;
            }, []);
        }

        this.familyDropDown.resize();
    }
}
