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
import { EntitiesService } from '../../../state/providers/entities.service';

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
    nodeTags: TagReferenceFromServer[] = []; // Tags for the current opened node.

    filteredTags: Tag[] = [];
    filterTerm = '';

    constructor(
        private changeDetector: ChangeDetectorRef,
        private state: ApplicationStateService,
        private editorEffects: EditorEffectsService,
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

    onFilterChange(term: string): void {
        this.filterTerm = term;

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

    displayAllTags(): void {
         // If no filter is typed in - we display the all the tags
         this.filteredTags = this.state.now.tags.tags.map(uuid => this.entities.getTag(uuid));

         if (!this.dropDown.isOpen) {
             this.dropDown.openDropdown();
         }
         this.dropDown.resize();
    }

    onInputFocus(event): void {
        this.onFilterChange(this.filterTerm);
    }

    onTagSelected(tag: Tag): void {
        const { name, tagFamily, uuid } = tag;
        this.nodeTags = [...this.nodeTags, { name, tagFamily: tagFamily.name, uuid }];
        this.filteredTags = [];
        this.inputField.writeValue('');
        this.newTagName = '';
        this.checkIfDirty();
    }

    onTagDeleted(deletedTag: Tag): void {
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

    private checkIfDirty(): void {
        const oldUuids = (this.node.tags || []).map(tag => tag.uuid).sort().join(',');
        const newUuids = this.nodeTags.map(tag => tag.uuid).sort().join(',');
        this.isDirty = newUuids !== oldUuids;
    }

    private filterTags(term: string): Tag[] {
        /*if (term.trim() === '') {
            return [];
        }*/

        const tags = this.state.now.tags.tags.map(uuid => this.entities.getTag(uuid));
        const filteredTags = tags.reduce<Tag[]>((filteredTags, tag) => {
            if (this.nodeTags.findIndex(existingTag => existingTag.uuid === tag.uuid) === -1) {
                if(fuzzyMatch(term, tag.name)) {
                   filteredTags.push(tag) ;
                }
            }
            return filteredTags;
        }, []);
        return filteredTags;
    }
}
