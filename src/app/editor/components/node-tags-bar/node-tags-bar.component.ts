import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DropdownList, InputField, ModalService } from 'gentics-ui-core';

import { MeshNode } from '../../../common/models/node.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Tag } from '../../../common/models/tag.model';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { TagReferenceFromServer } from '../../../common/models/server-models';
import { CreateTagDialogComponent, CreateTagDialogComponentResult } from '../create-tag-dialog/create-tag-dialog.component';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    selector: 'mesh-node-tags-bar',
    templateUrl: './node-tags-bar.component.html',
    styleUrls: ['./node-tags-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTagsBarComponent implements OnChanges, OnInit, OnDestroy {

    @ViewChild(DropdownList) dropDown: DropdownList;
    @ViewChild(InputField, { read: ElementRef }) inputField: ElementRef;
    @Input() node: MeshNode;
    inputIsFocused = false;
    isDirty = false;
    newTagName = '';
    nodeTags: TagReferenceFromServer[] = [];

    filteredTags: Tag[] = [];
    filterTerm = '';

    stateTags: Tag[] = [];
    private destroyed$: Subject<void> = new Subject();

    constructor(
        private changeDetector: ChangeDetectorRef,
        private state: ApplicationStateService,
        private editorEffects: EditorEffectsService,
        private modalService: ModalService,
        private entities: EntitiesService ) { }

    ngOnInit(): void {

        this.state.select(state => state.tags.tags)
            .takeUntil(this.destroyed$)
            .subscribe(tags => {
                this.stateTags = tags.map(uuid => this.entities.getTag(uuid));
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && changes.node.currentValue) {
            const node = changes.node.currentValue as MeshNode;
            this.nodeTags = node.tags ? [...node.tags] : [];
            this.isDirty = false;
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onFilterChange(term: string): void {
        this.filteredTags = this.filterTags(term);

        // If the term does NOT perfectly match any of existing tags - we will show an option to create one
        if (!this.stateTags.some(tag => tag.name.toLowerCase() === term.toLowerCase())) {
            this.newTagName = term;
        } else {
            this.newTagName = '';
        }

        if (!this.dropDown.isOpen) {
            this.dropDown.openDropdown();
        }
        this.dropDown.resize();
    }

    onInputFocus(): void {
        this.onFilterChange(this.filterTerm);
    }

    onInputBlur(): void {
        this.inputIsFocused = false;
    }

    onTagSelected(tag: Tag): void {
        const { name, tagFamily, uuid } = tag;
        this.nodeTags = [...this.nodeTags, { name, tagFamily: tagFamily.name, uuid }];
        this.filteredTags = [];
        this.filterTerm = '';
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
     * Get the diff of the original tags and the modified ones.
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

    addTagClick() {
        this.inputIsFocused = true;
        setTimeout(() => {
            this.inputField.nativeElement.querySelector('input').focus();
        }, 200);
    }

    private checkIfDirty(): void {
        const oldUuids = (this.node.tags || []).map(tag => tag.uuid).sort().join(',');
        const newUuids = this.nodeTags.map(tag => tag.uuid).sort().join(',');
        this.isDirty = newUuids !== oldUuids;
    }

    private filterTags(term: string): Tag[] {
        const filteredTags = this.stateTags.reduce<Tag[]>((filteredTags, tag) => {
            if (this.nodeTags.findIndex(existingTag => existingTag.uuid === tag.uuid) === -1) {
                if (fuzzyMatch(term, tag.name)) {
                   filteredTags.push(tag) ;
                }
            }
            return filteredTags;
        }, []);
        return filteredTags;
    }
}
