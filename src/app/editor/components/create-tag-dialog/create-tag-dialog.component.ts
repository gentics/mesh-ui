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

    filteredFamilies: FilterSelection[] = [];

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

    onFamilySelected(tagFamily: FilterSelection): void {
        this.inputTagFamilyValue = tagFamily.value;
    }

    saveTagToFamily(family: TagFamily, tagName: string) {
        this.tagsEffects.createTag(this.projectName, family.uuid, tagName)
            .then(tag => {
                this.closeFn({ tag, family });
            })
            .catch(error => {
                this.cancelFn(false)
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
                    this.cancelFn(false)
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

    private filterFamilies(): FilterSelection[] {
        let filterFamilies: FilterSelection[] = [];

        if (this.inputTagFamilyValue.trim() === '') {
            filterFamilies = this.tagFamilies.map(family => {
                return { value: family.name, valueFormatted: family.name };
            });
        } else {
            filterFamilies = this.tagFamilies.reduce<FilterSelection[]>((filteredFamilies, family) => {
                const matchedName = fuzzyReplace(this.inputTagFamilyValue, family.name);
                return matchedName ? [...filteredFamilies, matchedName] : filteredFamilies;
            }, []);
        }

        return filterFamilies;
    }
}