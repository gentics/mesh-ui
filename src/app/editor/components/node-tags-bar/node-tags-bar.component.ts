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
import { InputField, ModalService } from 'gentics-ui-core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MeshNode } from '../../../common/models/node.model';
import { TagReferenceFromServer } from '../../../common/models/server-models';
import { Tag } from '../../../common/models/tag.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { tagsAreEqual } from '../../form-generator/common/tags-are-equal';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import {
    CreateTagDialogComponent,
    CreateTagDialogComponentResult
} from '../create-tag-dialog/create-tag-dialog.component';

@Component({
    selector: 'mesh-node-tags-bar',
    templateUrl: './node-tags-bar.component.html',
    styleUrls: ['./node-tags-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTagsBarComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild(InputField, { read: ElementRef, static: true })
    inputField: ElementRef;

    @Input() node: MeshNode;
    inputIsFocused = false;
    isDirty = false;
    nodeTags: TagReferenceFromServer[] = [];
    displayTagSelection = false;
    filteredTags: Tag[] = [];
    filterTerm = '';
    allTags: Tag[] = [];
    private destroyed$: Subject<void> = new Subject();
    private focusTimer: any;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private state: ApplicationStateService,
        private editorEffects: EditorEffectsService,
        private modalService: ModalService,
        private entities: EntitiesService
    ) {}

    ngOnInit(): void {
        this.state
            .select(state => state.tags.tags)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(tags => {
                this.allTags = tags.map(uuid => this.entities.getTag(uuid)).filter(notNullOrUndefined);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && changes.node.currentValue) {
            const node = changes.node.currentValue as MeshNode;
            this.nodeTags = node.tags ? [...node.tags] : [];
            this.isDirty = false;
            this.changeDetector.markForCheck();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        clearTimeout(this.focusTimer);
    }

    onFilterChange(term: string): void {
        this.filteredTags = this.filterTags(this.allTags, this.nodeTags, term);
    }

    onInputFocus(): void {
        this.displayTagSelection = true;
        this.onFilterChange(this.filterTerm);
    }

    onInputBlur(): void {
        this.inputIsFocused = false;
    }

    onInputEscape(): void {
        this.displayTagSelection = false;
        this.inputField.nativeElement.querySelector('input').blur();
    }

    onTagSelected(tag: Tag): void {
        const { name, tagFamily, uuid } = tag;
        this.nodeTags = [...this.nodeTags, { name, tagFamily: tagFamily.name, uuid }];
        this.filteredTags = [];
        this.filterTerm = '';
        this.displayTagSelection = false;
        this.inputField.nativeElement.querySelector('input').blur();
        this.isDirty = this.checkIfDirty();
    }

    onTagDeleted(deletedTag: Tag): void {
        const tagIndex = this.nodeTags.findIndex(tag => tag.uuid === deletedTag.uuid);
        this.nodeTags.splice(tagIndex, 1);
        this.isDirty = this.checkIfDirty();
    }

    onCreateNewTagClick(newTagName: string): void {
        const openNode = this.state.now.editor.openNode;

        if (openNode) {
            this.modalService
                .fromComponent(
                    CreateTagDialogComponent,
                    {
                        closeOnOverlayClick: false
                    },
                    {
                        newTagName,
                        projectName: openNode.projectName
                    }
                )
                .then(modal => modal.open())
                .then((result: CreateTagDialogComponentResult) => {
                    this.onTagSelected(result.tag);
                    this.changeDetector.markForCheck();
                });
        }
    }

    /**
     * Get the diff of the original tags and the modified ones.
     */
    changesSinceLastSave(): { deletedTags: string[]; newTags: string[] } {
        let deletedTags: string[] = [];
        let newTags: string[] = [];

        if (this.node.tags) {
            deletedTags = this.node.tags
                .filter(tag => this.nodeTags.every(t => t.uuid !== tag.uuid))
                .map(tag => tag.name)
                .filter(notNullOrUndefined);

            newTags = this.nodeTags
                .filter(tag => this.node.tags.every(t => t.uuid !== tag.uuid))
                .map(tag => tag.name)
                .filter(notNullOrUndefined);
        }
        return { deletedTags, newTags };
    }

    addTagClick() {
        this.inputIsFocused = true;
        clearTimeout(this.focusTimer);
        this.focusTimer = setTimeout(() => {
            this.inputField.nativeElement.querySelector('input').focus();
        }, 200);
    }

    private checkIfDirty(): boolean {
        return tagsAreEqual(this.node.tags, this.nodeTags) === false;
    }

    /**
     * Filters allTags by the filterTerm, but also omits any currentTags (tags which already apply to the node)
     */
    private filterTags(allTags: Tag[], currentTags: TagReferenceFromServer[], filterTerm: string): Tag[] {
        function isIsCurrentTags(tag: Tag): boolean {
            return currentTags.findIndex(existingTag => existingTag.uuid === tag.uuid) !== -1;
        }
        return allTags.filter(tag => !!(!isIsCurrentTags(tag) && fuzzyMatch(filterTerm, tag.name)));
    }
}
