import { Component, OnInit, ViewChild } from '@angular/core';
import { IModalDialog, InputField, DropdownList } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { fuzzyMatch, fuzzyReplace } from '../../../common/util/fuzzy-search';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterSelection } from '../../../common/models/common.model';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ProjectEffectsService } from '../../../admin/providers/effects/project-effects.service';
import { Tag } from '../../../common/models/tag.model';

export interface CreateTagDialogComponentResult {
    tag: Tag;
    family: TagFamily;
}
@Component({
    selector: 'app-create-tag-dialog',
    templateUrl: './create-tag-dialog.component.html',
    styleUrls: ['./create-tag-dialog.component.scss']
})
export class CreateTagDialogComponent implements IModalDialog, OnInit {

    @ViewChild('InputTagName') inputTagName: InputField;
    @ViewChild('InputTagFamily') inputTagFamily: InputField;
    @ViewChild('TagFamilyList') familyDropDown: DropdownList;

    closeFn: (result: CreateTagDialogComponentResult) => void;
    cancelFn: (val?: any) => void;

    projectName: string;
    newTagName: string;
    inputTagFamilyValue: string = '';

    filteredFamilies: FilterSelection[]= [];

    private tagFamilies: TagFamily[] = [];

    constructor(
        private i18n: I18nService,
        private state: ApplicationStateService,
        private sanitizer: DomSanitizer,
        private projectEffect: ProjectEffectsService) {}

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
        if (!this.familyDropDown.isOpen) {
            this.familyDropDown.openDropdown();
        }
        this.filterFamilies();
    }

    onFamilySelected(tagFamily: FilterSelection): void {
        this.inputTagFamilyValue = tagFamily.value;
    }


    saveTagToFamily (family: TagFamily, tagName: string) {
        this.projectEffect.createTag(this.projectName, family.uuid, tagName)
        .then(tag => {
            this.closeFn({ tag, family });
        });
    }

    saveAndClose() {

        const familyName = this.inputTagFamilyValue.toLowerCase();
        const family = this.tagFamilies.find(f => f.name.toLowerCase() === familyName);

        if (!family) {
            // save a new family
            this.projectEffect.createTagFamily(this.projectName, familyName)
            .then(newFamily => this.saveTagToFamily(newFamily, this.newTagName));
        } else {
            this.saveTagToFamily(family, this.newTagName)
        }
    }

    registerCloseFn(close: (val: CreateTagDialogComponentResult) => void): void {
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
