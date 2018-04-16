import { Component, OnInit, ViewChild } from '@angular/core';
import { DropdownList, IModalDialog, InputField } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { DomSanitizer } from '@angular/platform-browser';

import { Tag } from '../../../common/models/tag.model';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { EntitiesService } from '../../../state/providers/entities.service';

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
    inputTagFamilyValue = '';

    filteredFamilies: TagFamily[] = [];

    private tagFamilies: TagFamily[] = [];

    constructor(
        private i18n: I18nService,
        private state: ApplicationStateService,
        private sanitizer: DomSanitizer,
        private tagsEffects: TagsEffectsService,
        private entities: EntitiesService) { }

    ngOnInit() {
        this.tagFamilies = this.state.now.tags.tagFamilies.map(uuid => this.entities.getTagFamily(uuid));
    }

    onFamilyNameInputChange(term: string): void {
        if (!this.familyDropDown.isOpen) {
            this.familyDropDown.openDropdown();
        }
        this.filteredFamilies = this.filterFamilies();
        this.familyDropDown.resize();
    }

    onFamilySelected(tagFamily: TagFamily): void {
        this.inputTagFamilyValue = tagFamily.name;
    }

    saveTagToFamily(family: TagFamily, tagName: string) {
        this.tagsEffects.createTag(this.projectName, family.uuid, tagName)
            .then(tag => {
                this.closeFn({ tag, family });
            })
            .catch(error => {
                this.cancelFn(false);
            });
    }

    saveAndClose() {
        if (!this.newTagName.trim()) {
            return;
        }

        const familyName = this.inputTagFamilyValue.toLowerCase();
        const family = this.tagFamilies.find(f => f.name.toLowerCase() === familyName);

        if (!family) {
            // save a new family
            this.tagsEffects.createTagFamily(this.projectName, familyName)
                .then(newFamily => {
                    this.saveTagToFamily(newFamily, this.newTagName);
                })
                .catch(error => {
                    this.cancelFn(false);
                });
        } else {
            this.saveTagToFamily(family, this.newTagName);
        }
    }

    registerCloseFn(close: (val: CreateTagDialogComponentResult) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    private filterFamilies(): TagFamily[] {
        let filterFamilies: TagFamily[] = [];

        if (this.inputTagFamilyValue.trim() === '') {
            filterFamilies = [...this.tagFamilies];
        } else {
            filterFamilies = this.tagFamilies.reduce<TagFamily[]>((filteredFamilies, family) => {
                if (fuzzyMatch(this.inputTagFamilyValue, family.name)) {
                    return [...filteredFamilies, family];
                } else {
                    return filteredFamilies;
                }
            }, []);
        }
        return filterFamilies;
    }
}
