import { Input, ChangeDetectorRef, ContentChild, ViewChild, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DropdownList, InputField, ModalService } from 'gentics-ui-core';
import { MeshNode } from '../../../common/models/node.model';
import { fuzzyMatch, fuzzyReplace } from '../../../common/util/fuzzy-search';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Tag } from '../../../common/models/tag.model';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { TagReferenceFromServer } from '../../../common/models/server-models';
import { stringToColor } from '../../../common/util/util';
import { CreateTagDialogComponent, CreateTagDialogComponentResult } from '../create-tag-dialog/create-tag-dialog.component';
import { FilterSelection } from '../../../common/models/common.model';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { tagsAreEqual } from '../../form-generator/common/tags-are-equal';

@Component({
    selector: 'app-node-tags-bar',
    templateUrl: './node-tags-bar.component.html',
    styleUrls: ['./node-tags-bar.component.scss']
})
export class NodeTagsBarComponent implements OnChanges {

    @ViewChild('DropdownList') dropDown: DropdownList;
    @ViewChild('InputField') inputField: InputField;
    @Input() node: MeshNode;
    isDirty = false;
    newTagName = ''; // Contains a name for a new tag.
    nodeTags: TagReferenceFromServer[] = []; //tags for the current opened node

    filteredTags: FilterSelection[] = [];

    constructor(
        private changeDetector: ChangeDetectorRef,
        private state: ApplicationStateService,
        private editorEffects: EditorEffectsService,
        private sanitized: DomSanitizer,
        private modalService: ModalService,
        private entities: EntitiesService ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && changes.node.currentValue) {
            const node = changes.node.currentValue as MeshNode;
            this.nodeTags = node.tags ? [...node.tags] : [];
            this.isDirty = false;
            this.inputField.writeValue('');
        }
    }

    onFilterChange(term: string) {

        this.filteredTags = this.filterTags(term);

        const tags = this.state.now.tags.tags.map(uuid => this.entities.getTag(uuid));

        // If the term does NOT perfectly match any of existing tags - we will show an option to create one
        if (!tags.some(tag => tag.name.toLowerCase() === term.toLowerCase())) {
            this.newTagName = term;
        } else {
            this.newTagName = '';
        }

        if (!this.dropDown.isOpen) {
            this.dropDown.openDropdown();
        }
        this.dropDown.resize();
    }

    onTagSelected(tag: Tag) {
        const { name, tagFamily, uuid } = tag;
        this.nodeTags = [...this.nodeTags, { name, tagFamily: tagFamily.name, uuid }];
        this.filteredTags = [];
        this.inputField.writeValue('');
        this.newTagName = '';
        this.checkIfDirty();
    }

    onTagDeleted(deletedTag: Tag) {
        const tagIndex = this.nodeTags.findIndex(tag => tag.uuid === deletedTag.uuid);
        this.nodeTags.splice(tagIndex, 1);
        this.checkIfDirty();
    }

    onCreateNewTagClick(): void {
        this.modalService.fromComponent(
            CreateTagDialogComponent,
            {
                closeOnOverlayClick: false
            },
            {
                newTagName: this.newTagName,
                projectName: this.state.now.editor.openNode.projectName
            }
        )
        .then(modal => modal.open())
        .then((result: CreateTagDialogComponentResult) => {
            this.onTagSelected(result.tag);
            this.changeDetector.markForCheck();
        });
    }

    /**
     * Get the diff of the original tags and the modified ones
     * return and
     */
    changesSinceLastSave(): { deletedTags: string[], newTags: string[] } {
        let deletedTags: string[] = [];
        let newTags: string[] = [];

        if (this.node.tags) {
            deletedTags = this.node.tags
                .filter(tag => this.nodeTags.every(t => t.uuid !== tag.uuid))
                .map(tag => tag.name);

            newTags = this.nodeTags
                .filter(tag => this.node.tags.every(t => t.uuid !== tag.uuid))
                .map(tag => tag.name);
        }
        return { deletedTags, newTags };
    }

    getTagBackgroundColor(familyName: string): SafeStyle {
        return this.sanitized.bypassSecurityTrustStyle(stringToColor(familyName));
    }

    private checkIfDirty() {
        return tagsAreEqual(this.node.tags, this.nodeTags);
    }

    private filterTags(term: string): FilterSelection[] {
        if (term.trim() === '') {
            return [];
        }

        const tags = this.state.now.tags.tags.map(uuid => this.entities.getTag(uuid));
        const filteredTags = tags.reduce<FilterSelection[]>((filteredTags, tag) => {
            if (this.nodeTags.findIndex(existingTag => existingTag.uuid === tag.uuid) === -1) {
                const matchedName = fuzzyReplace(term, tag.name);
                if (matchedName) {
                    filteredTags.push({ ...matchedName, tag });
                }
            }
            return filteredTags;
        }, []);
        return filteredTags;
    }
}
